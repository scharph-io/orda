import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Role } from '@core/models/role';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog.component';
import { RoleDialogComponent } from '@features/manage/roles/role-dialog/role-dialog.component';
import { filter, switchMap } from 'rxjs';
import { RoleService } from '@features/manage/services/role.service';

@Component({
	selector: 'orda-roles',
	imports: [MatButtonModule, MatListModule, MatIcon, TitleCasePipe],
	template: `
		<div class="title-toolbar">
			<h2>Roles</h2>
			<button mat-button (click)="create()">New</button>
		</div>

		<mat-list role="list">
			@for (role of roleService.rolesResource.value(); track role.id) {
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
							<button title="update role policy" mat-icon-button (click)="updatePolicy(role)">
								<mat-icon>policy</mat-icon>
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
export class RolesComponent {
	roleService = inject(RoleService);
	dialog = inject(MatDialog);

	delete(role: Role) {
		this.dialog
			.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
				data: {
					message: role.name,
				} as ConfirmDialogData,
			})
			.afterClosed()
			.pipe(
				filter((res) => res !== undefined),
				switchMap(() => this.roleService.deleteRole(role.id ?? '')),
			)
			.subscribe({
				next: () => {
					this.roleService.rolesResource.reload();
				},
				error: (err) => {
					console.log(err.message);
				},
			});
	}

	edit(role: Role) {
		this.dialog
			.open<RoleDialogComponent, Role, Role>(RoleDialogComponent, {
				data: role,
			})
			.afterClosed()
			.pipe(
				filter((res) => res !== undefined),
				switchMap((res) => this.roleService.updateRole(role.id ?? '', res)),
			)
			.subscribe({
				next: () => this.roleService.rolesResource.reload(),
				error: (err) => {
					console.log(err.message);
				},
			});
	}

	create() {
		this.dialog
			.open<RoleDialogComponent, undefined, Role>(RoleDialogComponent)
			.afterClosed()
			.pipe(
				filter((res) => res !== undefined),
				switchMap((res) => this.roleService.createRole(res)),
			)
			.subscribe({
				next: () => this.roleService.rolesResource.reload(),
				error: (err) => {
					console.log(err);
				},
			});
	}

	updatePolicy(role: Role) {
		console.log('update policy for ' + role.name);
	}
}
