import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '@orda.core/models/role';
import { MatListModule } from '@angular/material/list';
import { RoleService } from '@orda.features/data-access/services/role.service';
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

@Component({
	selector: 'orda-roles',
	imports: [MatButtonModule, MatListModule, MatIcon, TitleCasePipe],
	template: `
		<div class="title-toolbar">
			<h2>Roles</h2>
			<button mat-button (click)="create()">New</button>
		</div>

		<mat-list role="list">
			@for (role of roleService.entityResource.value(); track role.id) {
				<mat-list-item role="listitem">
					<div class="item">
						<p>{{ role.name | titlecase }}</p>
						<div>
							<button title="delete role" class="red-btn" mat-icon-button (click)="delete(role)">
								<mat-icon>delete</mat-icon>
							</button>
							<button title="edit role" mat-icon-button (click)="edit(role)">
								<mat-icon>edit</mat-icon>
							</button>
							<!-- <button title="update role policy" mat-icon-button (click)="updatePolicy(role)">
                <mat-icon>policy</mat-icon>
              </button> -->
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

		/*mat-list {*/
		/*	width: 50%;*/
		/*}*/

		.title-toolbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	`,
})
export class RolesComponent extends EntityManager<Role> {
	roleService = inject(RoleService);
	logger = inject(OrdaLogger);

	constructor() {
		super();
		this.roleService.entityResource.reload();
	}

	create() {
		this.dialogClosed<RoleDialogComponent, undefined, Role>(
			RoleDialogComponent,
			undefined,
		).subscribe(() => this.roleService.entityResource.reload());
	}

	edit(r: Role) {
		this.dialogClosed<RoleDialogComponent, Role, Role>(RoleDialogComponent, r).subscribe(() =>
			this.roleService.entityResource.reload(),
		);
	}

	delete(r: Role) {
		this.roleService
			.readById(r.id ?? '')
			.pipe(
				switchMap((role) =>
					this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
						ConfirmDialogComponent,
						{
							message:
								(role.users ?? []).length === 0
									? role.name
									: `Role '${role.name}' is in use by ${(role.users ?? []).length} users`,
							disableSubmit: (role.users ?? []).length !== 0,
						},
					),
				),
			)
			.pipe(
				filter((res) => res),
				switchMap(() => this.roleService.delete(r.id)),
			)
			.subscribe({
				next: () => {
					this.roleService.entityResource.reload();
				},
				error: (err) => this.logger.error(err),
			});
	}

	// updatePolicy(role: Role) {
	// 	console.log('update policy for ' + role.name);
	// }
}

@Component({
	selector: 'orda-role-dialog',
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
			</form>
			<!-- can save {{ canSubmit() }} -->
		</ng-template>
	`,
	styles: ``,
})
class RoleDialogComponent extends DialogTemplateComponent<Role> {
	roleService = inject(RoleService);

	formGroup = new FormGroup({
		name: new FormControl('', [
			Validators.required,
			Validators.maxLength(10),
			Validators.minLength(3),
		]),
	});

	constructor() {
		super();
		this.formGroup.patchValue({
			name: this.inputData?.name,
		});

		// this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
		// 	this.canSubmit.set(
		// 		!(this.roleService.resource.value() ?? []).some(
		// 			(role) => role.name === this.formGroup.value.name,
		// 		),
		// 	);
		// });
	}

	public submit = () => {
		if (this.inputData) {
			this.roleService
				.update(this.inputData?.id ?? '', {
					name: this.formGroup.value.name ?? '',
				})
				.subscribe(this.closeObserver);
		} else {
			this.roleService
				.create({
					name: this.formGroup.value.name ?? '',
				})
				.subscribe(this.closeObserver);
		}
	};
}
