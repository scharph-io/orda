import { Component, inject } from '@angular/core';
import { RoleService } from '../services/role.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from '@angular/material/expansion';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'orda-roles',
	imports: [MatExpansionModule, TitleCasePipe, MatButtonModule],
	template: `
		@for (role of roles(); track role.id) {
			<mat-accordion class="role">
				<mat-expansion-panel>
					<mat-expansion-panel-header>
						<mat-panel-title> {{ role.name | titlecase }}</mat-panel-title>
					</mat-expansion-panel-header>

					<ng-template matExpansionPanelContent>
						<h4>Manage</h4>
						<button mat-button>Delete</button>
						<!--            <orda-permissions-table [role]="role.name" />-->
					</ng-template>
				</mat-expansion-panel>
			</mat-accordion>
		}
	`,
	styles: ``,
})
export class RolesComponent {
	#roleService = inject(RoleService);
	protected roles = toSignal(this.#roleService.getRoles(), { initialValue: [] });

	constructor() {}
}
