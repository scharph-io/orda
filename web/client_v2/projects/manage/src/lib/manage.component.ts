import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-manage',
  imports: [RouterModule, MatButtonModule],
  template: `
    <p>
      manage overview!
      <button mat-button [routerLink]="'roles'">Roles</button>
      <button mat-button [routerLink]="'assortment'">Assortment</button>
      <button mat-button [routerLink]="'accounts'">Accounts</button>
    </p>
  `,
  styles: ``,
})
export class ManageComponent {}
