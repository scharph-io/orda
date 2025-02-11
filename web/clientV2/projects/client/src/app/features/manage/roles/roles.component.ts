import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '@core/models/role';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog.component';
import { RoleDialogComponent } from '@features/manage/roles/role-dialog/role-dialog.component';
import { switchMap } from 'rxjs';
import { RoleService } from '@features/data-access/services/role.service';
import { EntityManager } from '@shared/utils/entity-manager';

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
		this.dialogAfterClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
			ConfirmDialogComponent,
			{
				message: role.name,
			},
		)
			.pipe(switchMap(() => this.roleService.deleteRole(role.id ?? '')))
			.subscribe(this.fnObserver(() => this.roleService.resource.reload()));
	}

	edit(role: Role) {
		this.dialogAfterClosed<RoleDialogComponent, Role, Role>(RoleDialogComponent, role)
			.pipe(switchMap((res) => this.roleService.updateRole(role.id ?? '', res)))
			.subscribe(this.fnObserver(() => this.roleService.resource.reload()));
	}

	create() {
		this.dialogAfterClosed<RoleDialogComponent, undefined, Role>(RoleDialogComponent, undefined)
			.pipe(switchMap((res) => this.roleService.createRole(res)))
			.subscribe(this.fnObserver(() => this.roleService.resource.reload()));
	}

	// updatePolicy(role: Role) {
	// 	console.log('update policy for ' + role.name);
	// }
}
