import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { MatRipple } from '@angular/material/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'orda-order',
	imports: [MatGridListModule, MatRipple, RouterModule],
	template: `
		<h1>Order Views</h1>
		<mat-grid-list cols="4" rowHeight="2:1">
			@for (v of viewService.views.value(); track v.id) {
				<mat-grid-tile mat-ripple [routerLink]="['view', v.id]">
          {{ v.name }} ({{v.products_count}})
        </mat-grid-tile>
			}
		</mat-grid-list>
	`,
	styles: ``,
})
export class OrderComponent {
	viewService = inject(OrderService);
}
