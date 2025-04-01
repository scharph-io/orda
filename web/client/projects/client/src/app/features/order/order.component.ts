import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { MatRipple } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { ViewBreakpointService } from '@orda.shared/services/view-breakpoint.service';
import { GridColSizeService } from '@orda.shared/services/gridcolsize.service';

@Component({
	selector: 'orda-order',
	imports: [MatGridListModule, MatRipple, RouterModule],
	template: `
		<h1>Order Views</h1>
		@let views = viewService.views.value() ?? [];
		@if (views.length === 0) {
			<p>No views available</p>
		} @else {
			<mat-grid-list cols="4" rowHeight="1:1">
				@for (v of viewService.views.value(); track v.id) {
					<mat-grid-tile
						mat-ripple
						[routerLink]="['view', v.id]"
						[style]="{ 'background-color': 'lightblue' }"
					>
						{{ v.name }} ({{ v.products_count }})
					</mat-grid-tile>
				}
			</mat-grid-list>
		}
	`,
	styles: ``,
})
export class OrderComponent {
	viewService = inject(OrderService);
	breakpointService = inject(ViewBreakpointService);

	gridCols = inject(GridColSizeService).size;

	constructor() {
		this.viewService.views.reload();
	}
}
