import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'orda-manage',
	imports: [RouterModule, MatButtonModule],
	template: `
		<p>manage works!</p>
		<button mat-button [routerLink]="'roles'">Roles</button>
	`,
	styles: ``,
})
export class ManageComponent {}
