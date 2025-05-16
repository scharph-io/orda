import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AssortmentGroup } from '@orda.core/models/assortment';
import { MatListModule } from '@angular/material/list';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, switchMap } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { RouterModule } from '@angular/router';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';

@Component({
	selector: 'orda-assortment-groups',
	imports: [MatButtonModule, MatListModule, MatIcon, TitleCasePipe, RouterModule],
	template: `
		<h1>Sortiment</h1>
		<div class="title-toolbar">
			<button mat-button (click)="create()">New</button>
		</div>

		<mat-list role="list">
			@for (assortmentGroup of assortmentService.groups.value(); track assortmentGroup.id) {
				<mat-list-item role="listitem">
					<div class="item">
						<p [routerLink]="[assortmentGroup.id]" routerLinkActive="router-link-active">
							{{ assortmentGroup.name | titlecase }}
						</p>
						<div>
							<button
								title="delete assortment group"
								class="delete-btn"
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
	assortmentService = inject(AssortmentService);
	logger = inject(OrdaLogger);

	constructor() {
		super();
	}

	create() {
		this.dialogClosed<AssortmentGroupDialogComponent, undefined, AssortmentGroup>(
			AssortmentGroupDialogComponent,
			undefined,
		).subscribe(() => this.assortmentService.groups.reload());
	}

	edit(ag: AssortmentGroup) {
		this.dialogClosed<AssortmentGroupDialogComponent, AssortmentGroup, AssortmentGroup>(
			AssortmentGroupDialogComponent,
			ag,
		).subscribe(() => this.assortmentService.groups.reload());
	}

	delete(ag: AssortmentGroup) {
		this.assortmentService
			.readGroupById(ag.id ?? '')
			.pipe(
				switchMap((assortmentGroup) =>
					this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
						ConfirmDialogComponent,
						{
							message: assortmentGroup.name,
						},
					),
				),
			)
			.pipe(
				filter((res) => res),
				switchMap(() => this.assortmentService.deleteGroup(ag.id)),
			)
			.subscribe({
				next: () => {
					this.assortmentService.groups.reload();
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
				<div class="dialog-flex">
					<mat-form-field>
						<mat-label>Name</mat-label>
						<input matInput formControlName="name" />
					</mat-form-field>
					<mat-form-field>
						<mat-label>Description</mat-label>
						<input matInput formControlName="desc" />
					</mat-form-field>
				</div>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AssortmentGroupDialogComponent extends DialogTemplateComponent<AssortmentGroup> {
	assortmentService = inject(AssortmentService);

	formGroup = new FormGroup({
		name: new FormControl('', [
			Validators.required,
			Validators.maxLength(50),
			Validators.minLength(3),
		]),
		desc: new FormControl('', Validators.required),
	});

	constructor() {
		super();
		this.formGroup.patchValue({
			name: this.inputData?.name,
			desc: this.inputData?.desc,
		});
	}

	public submit = () => {
		if (this.inputData) {
			this.assortmentService
				.updateGroup(this.inputData?.id ?? '', {
					name: this.formGroup.value.name ?? '',
					desc: this.formGroup.value.desc ?? '',
				})
				.subscribe(this.closeObserver);
		} else {
			this.assortmentService
				.createGroup({
					name: this.formGroup.value.name ?? '',
					desc: this.formGroup.value.desc ?? '',
				})
				.subscribe(this.closeObserver);
		}
	};
}
