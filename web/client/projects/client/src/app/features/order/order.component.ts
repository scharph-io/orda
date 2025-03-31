import { Component, inject, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { MatRipple } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { ViewBreakpointService } from '@orda.shared/services/view-breakpoint.service';

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
					<mat-grid-tile mat-ripple [routerLink]="['view', v.id]" [style]="{'background-color': 'lightblue'}" >
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
  breakpointService = inject(ViewBreakpointService)

  gridCols = signal(4)

	constructor() {
		this.viewService.views.reload();

    this.breakpointService.getBreakpoint().subscribe(breakpoint => {
      switch (breakpoint) {
        case "handset":
          this.gridCols.set(2)
          break;
        case "tablet":
          this.gridCols.set(7)
          break;
        case "desktop":
          this.gridCols.set(8)
          break;
      }

      console.log("sds",breakpoint)

    })
	}
}
