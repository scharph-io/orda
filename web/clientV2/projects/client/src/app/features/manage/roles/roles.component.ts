import { Component, inject } from '@angular/core';
import { RoleService } from '../services/role.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'orda-roles',
	imports: [MatExpansionModule, TitleCasePipe, MatButtonModule],
	template: `
		{{ roleService.rolesResource.isLoading() }}
		@for (role of roleService.rolesResource.value(); track role.id) {
			<mat-accordion class="role">
				<mat-expansion-panel>
					<mat-expansion-panel-header>
						<mat-panel-title>{{ role.id }} {{ role.name | titlecase }}</mat-panel-title>
					</mat-expansion-panel-header>

					<ng-template matExpansionPanelContent>
						<h4>Manage</h4>
						@if (role.id) {
							<button mat-button (click)="delete(role.id)">Delete</button>
						}
						<!--            <orda-permissions-table [role]="role.name" />-->
					</ng-template>
				</mat-expansion-panel>
			</mat-accordion>
		}

		<button (click)="createNewRole()">Reload</button>
	`,
	styles: ``,
})
export class RolesComponent {
	roleService = inject(RoleService);

	// protected roles = toSignal(this.#roleService.getRoles(), { initialValue: [] });

	createNewRole() {
		this.roleService.createRole({ name: 'waiter' }).subscribe({
			next: () => {
				this.roleService.rolesResource.reload();
			},
		});
	}

	delete(id: string) {
		this.roleService.deleteRole(id).subscribe({
			next: () => {
				console.log('deleted');
				this.roleService.rolesResource.reload();
			},
		});
	}
}
