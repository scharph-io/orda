import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { PermissionDirective } from '../../../shared/src/lib/permission/permission.directive';
import { PolicyManagerComponent } from '../../../shared/src/lib/permission/permission-manager/permission-manager.component';

@Component({
  selector: 'lib-manage',
  imports: [
    RouterModule,
    MatButtonModule,
    PermissionDirective,
    PolicyManagerComponent,
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

    <app-policy-manager />
  `,
  styles: ``,
})
export class ManageComponent {}
