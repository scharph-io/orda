import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '@core/models/role';
import { MatListModule } from '@angular/material/list';
import { RoleService } from '@features/data-access/services/role.service';
import { EntityManager } from '@shared/utils/entity-manager';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@shared/components/dialog/dialog-template.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { Observable, switchMap } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
	selector: 'orda-roles',
	imports: [MatButtonModule, MatListModule, MatIcon, TitleCasePipe],
	template: `
		<div class="title-toolbar">
			<h2>Roles</h2>
			<button mat-button (click)="create()">New</button>
		</div>

		<mat-list role="list">
			@for (role of roleService.resource.value(); track role.id) {
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

	delete(role: Role) {
		console.log(role);

		this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
			message: role.name,
		})
			.pipe(switchMap(() => this.roleService.delete(role.id ?? '')))
			.subscribe(this.fnObserver(() => this.roleService.resource.reload()));
	}

	edit(role: Role) {
		this.dialogClosed<RoleDialogComponent, Role, Role>(RoleDialogComponent, role).subscribe(
			this.fnObserver<Role>((r) => {
				console.log('Update role', r.name);
				this.roleService.resource.reload();
			}),
		);
	}

	create() {
		this.dialogClosed<RoleDialogComponent, undefined, Role>(
			RoleDialogComponent,
			undefined,
		).subscribe(
			this.fnObserver<Role>((r) => {
				console.log('Created role', r.name);
				this.roleService.resource.reload();
			}),
		);
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
		MatFormField,
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
	}

	public submit = () => {
		this.isLoading.set(true);
		let req$: Observable<Role>;
		if (this.inputData) {
			req$ = this.roleService.update(this.inputData.id ?? '', {
				name: this.formGroup.value.name ?? '',
			});
		} else {
			req$ = this.roleService.create({
				name: this.formGroup.value.name ?? '',
			});
		}
		req$.subscribe({
			next: (data) => {
				this.isLoading.set(false);
				this.dialogRef.close(data);
			},
		});
	};
}
