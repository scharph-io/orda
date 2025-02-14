import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AssortmentGroup } from '@core/models/assortment-group';
import { MatListModule } from '@angular/material/list';
import { AssortmentGroupService } from '@features/data-access/services/assortment.service';
import { EntityManager } from '@shared/utils/entity-manager';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@shared/components/dialog/dialog-template.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { OrdaLogger } from '@shared/services/logger.service';
import { filter, switchMap } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
	selector: 'orda-assortment-groups',
	imports: [MatButtonModule, MatListModule, MatIcon, TitleCasePipe],
	template: `
		<div class="title-toolbar">
			<h2>Assortment Groups</h2>
			<button mat-button (click)="create()">New</button>
		</div>

		<mat-list role="list">
			@for (assortmentGroup of assortmentGroupService.resource.value(); track assortmentGroup.id) {
				<mat-list-item role="listitem">
					<div class="item">
						<p>{{ assortmentGroup.name | titlecase }}</p>
						<div>
							<button
								title="delete assortment group"
								class="red-btn"
								mat-icon-button
								(click)="delete(assortmentGroup)"
							>
								<mat-icon>delete</mat-icon>
							</button>
							<button title="edit assortment group" mat-icon-button (click)="edit(assortmentGroup)">
								<mat-icon>edit</mat-icon>
							</button>
						</div>
					</div>
				</mat-list-item>
			}
		</mat-list>
	`,
	styles: `
		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.title-toolbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	`,
})
export class AssortmentGroupsComponent extends EntityManager<AssortmentGroup> {
	assortmentGroupService = inject(AssortmentGroupService);
	logger = inject(OrdaLogger);

	constructor() {
		super();
		this.assortmentGroupService.resource.reload();
	}

	create() {
		this.dialogClosed<AssortmentGroupDialogComponent, undefined, AssortmentGroup>(
			AssortmentGroupDialogComponent,
			undefined,
		).subscribe(() => this.assortmentGroupService.resource.reload());
	}

	edit(ag: AssortmentGroup) {
		this.dialogClosed<AssortmentGroupDialogComponent, AssortmentGroup, AssortmentGroup>(
			AssortmentGroupDialogComponent,
			ag,
		).subscribe(() => this.assortmentGroupService.resource.reload());
	}

	delete(ag: AssortmentGroup) {
		this.assortmentGroupService
			.readById(ag.id ?? '')
			.pipe(
				switchMap((assortmentGroup) =>
					this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
						ConfirmDialogComponent,
						{
							message: assortmentGroup.name,
							disableSubmit: false,
						},
					),
				),
			)
			.pipe(
				filter((res) => res),
				switchMap(() => this.assortmentGroupService.delete(ag.id)),
			)
			.subscribe({
				next: () => {
					this.assortmentGroupService.resource.reload();
				},
				error: (err) => this.logger.error(err),
			});
	}
}

@Component({
	selector: 'orda-assortment-group-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		DialogTemplateComponent,
		MatLabel,
		MatFormFieldModule,
		MatInput,
	],
	template: `
		<orda-dialog-template
			[customTemplate]="template"
			[form]="formGroup"
			(submitClick)="submit()"
		></orda-dialog-template>
		<ng-template #template>
			<form [formGroup]="formGroup">
				<mat-form-field>
					<mat-label>Name</mat-label>
					<input matInput formControlName="name" />
				</mat-form-field>
				<mat-form-field>
					<mat-label>Description</mat-label>
					<input matInput formControlName="desc" />
				</mat-form-field>
				<mat-form-field>
					<mat-label>Deposit</mat-label>
					<input matInput type="number" formControlName="deposit" />
				</mat-form-field>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AssortmentGroupDialogComponent extends DialogTemplateComponent<AssortmentGroup> {
	assortmentGroupService = inject(AssortmentGroupService);

	formGroup = new FormGroup({
		name: new FormControl('', [
			Validators.required,
			Validators.maxLength(50),
			Validators.minLength(3),
		]),
		desc: new FormControl('', Validators.required),
		deposit: new FormControl(0, [Validators.required, Validators.min(0)]),
	});

	constructor() {
		super();
		this.formGroup.patchValue({
			name: this.inputData?.name,
			desc: this.inputData?.desc,
			deposit: this.inputData?.deposit,
		});
	}

	public submit = () => {
		if (this.inputData) {
			this.assortmentGroupService
				.update(this.inputData?.id ?? '', {
					name: this.formGroup.value.name ?? '',
					desc: this.formGroup.value.desc ?? '',
					deposit: this.formGroup.value.deposit ?? 0,
				})
				.subscribe(this.closeObserver);
		} else {
			this.assortmentGroupService
				.create({
					name: this.formGroup.value.name ?? '',
					desc: this.formGroup.value.desc ?? '',
					deposit: this.formGroup.value.deposit ?? 0,
				})
				.subscribe(this.closeObserver);
		}
	};
}
