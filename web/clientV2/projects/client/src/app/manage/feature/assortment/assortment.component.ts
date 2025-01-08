import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { PolicyManagerComponent } from '../../../../shared/src/lib/permission/permission-manager/permission-manager.component';

@Component({
	selector: 'lib-assortment',
	imports: [MatButtonModule, RouterModule],
	templateUrl: './assortment.component.html',
	styleUrl: './assortment.component.css',
})
export class AssortmentComponent {}
