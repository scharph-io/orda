import { Component, computed, effect, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { PermissionDirective } from '../../../shared/src/lib/permission/permission.directive';
import { PolicyManagerComponent } from '../../../shared/src/lib/permission/permission-manager/permission-manager.component';
import { PolicyStore } from '../../../shared/src/lib/policy/policy-store';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'lib-manage',
	imports: [
		RouterModule,
		MatButtonModule,
		PermissionDirective,
		// PolicyManagerComponent,
		JsonPipe,
	],
	template: `
		manage overview!

		<button
			mat-button
			[routerLink]="'assortment'"
			[appPermission]="{ resource: 'assortment', action: 'read' }"
		>
			Assortment
		</button>
		<button
			mat-button
			[routerLink]="'accounts'"
			[appPermission]="{ resource: 'accounts', action: 'read' }"
		>
			Accounts
		</button>
		<button
			mat-button
			[routerLink]="'roles'"
			[appPermission]="{ resource: 'role', action: 'read' }"
		>
			Roles
		</button>

		<!-- <app-policy-manager /> -->

		{{ isLoading() ? 'Loading...' : '' }}
		{{ policies() | json }}
	`,
	styles: ``,
})
export class ManageComponent {
	private policyStore = inject(PolicyStore);
	isLoading = computed(() => this.policyStore.isLoading());
	policies = computed(() => this.policyStore.getPolicies('user'));

	constructor() {
		// effect(() => {
		//   this.policyStore.getPolicies('sd');
		// });
	}
}
