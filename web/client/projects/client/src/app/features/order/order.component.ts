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
		<h1>Bestellseiten</h1>
		@let views = viewService.views.value() ?? [];
		@if (views.length === 0) {
			<p>No views available</p>
		} @else {
			<mat-grid-list [cols]="gridCols()" rowHeight="1:1" gutterSize="0.5rem">
				@for (v of viewService.views.value(); track v.id) {
					<mat-grid-tile mat-ripple [routerLink]="['view', v.id]">
						<div class="container">
							<div class="title">{{ v.name }}</div>
							<div class="cnt">{{ v.products_count }} Produkte</div>
						</div>
					</mat-grid-tile>
				}
			</mat-grid-list>
		}
	`,
	styles: `
		.container {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			align-content: center;
		}

		.title {
			font-size: 1.5em;
			font-weight: 500;
		}

		.cnt {
			font-weight: 300;
			color: grey;
		}
	`,
})
export class OrderComponent {
	viewService = inject(OrderService);
	breakpointService = inject(ViewBreakpointService);

	gridCols = inject(GridColSizeService).size;

	constructor() {
		this.viewService.views.reload();
	}
}
