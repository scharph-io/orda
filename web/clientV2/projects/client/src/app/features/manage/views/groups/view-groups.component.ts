import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, switchMap } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { View } from '@orda.core/models/view';
import { MatSelect } from '@angular/material/select';
import { RoleService } from '@orda.features/data-access/services/role.service';
import { MatOption } from '@angular/material/core';

@Component({
	selector: 'orda-view-groups',
	imports: [MatButtonModule, MatListModule, MatIcon, TitleCasePipe, RouterModule, JsonPipe],
	template: `
		<div class="title-toolbar">
			<h2>View</h2>
			<button mat-button (click)="create()">New</button>
		</div>

		<mat-list role="list">
			@for (group of viewService.entityResource.value(); track group.id) {
				<mat-list-item role="listitem">
					<div class="item">
						<p [routerLink]="[group.id]" routerLinkActive="router-link-active">
							{{ group.name | titlecase }} {{ group.id }} {{ group | json }}
						</p>
						<div>
							<button
								title="delete assortment group"
								class="red-btn"
								mat-icon-button
								(click)="delete(group)"
							>
								<mat-icon>delete</mat-icon>
							</button>
							<button title="edit assortment group" mat-icon-button (click)="edit(group)">
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
export class ViewGroupsComponent extends EntityManager<View> {
	viewService = inject(ViewService);
	logger = inject(OrdaLogger);

	constructor() {
		super();
	}

	create() {
		this.dialogClosed<ViewGroupDialogComponent, undefined, View>(
			ViewGroupDialogComponent,
			undefined,
		).subscribe(() => this.viewService.entityResource.reload());
	}

	edit(v: View) {
		this.dialogClosed<ViewGroupDialogComponent, View, View>(ViewGroupDialogComponent, v).subscribe(
			() => this.viewService.entityResource.reload(),
		);
	}

	delete(v: View) {
		this.viewService
			.readById(v.id ?? '')
			.pipe(
				switchMap((view) =>
					this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
						ConfirmDialogComponent,
						{
							message: view.name,
						},
					),
				),
			)
			.pipe(
				filter((res) => res),
				switchMap(() => this.viewService.delete(v.id)),
			)
			.subscribe({
				next: () => {
					this.viewService.entityResource.reload();
				},
				error: (err) => this.logger.error(err),
			});
	}
}

@Component({
	selector: 'orda-view-group-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		DialogTemplateComponent,
		MatLabel,
		MatFormFieldModule,
		MatInput,
		MatSelect,
		MatOption,
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
					<mat-label>Roles</mat-label>
					<mat-select formControlName="roles" multiple>
						@for (role of roleService.entityResource.value(); track role) {
							<mat-option [value]="role">{{ role.name }}</mat-option>
						}
					</mat-select>
				</mat-form-field>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class ViewGroupDialogComponent extends DialogTemplateComponent<View> {
	viewService = inject(ViewService);
	roleService = inject(RoleService);

	viewDetails: View = httpRes();

	formGroup = new FormGroup({
		name: new FormControl('', [
			Validators.required,
			Validators.maxLength(50),
			Validators.minLength(3),
		]),
		roles: new FormControl(''),
	});

	constructor() {
		super();

		this.formGroup.patchValue({
			name: this.inputData?.name,
		});
	}

	public submit = () => {
		if (this.inputData) {
			this.viewService
				.update(this.inputData?.id ?? '', {
					name: this.formGroup.value.name ?? '',
				})
				.subscribe(this.closeObserver);
		} else {
			this.viewService
				.create({
					name: this.formGroup.value.name ?? '',
				})
				.subscribe(this.closeObserver);
		}
	};
}
