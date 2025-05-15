import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { MatRipple } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { ViewBreakpointService } from '@orda.shared/services/view-breakpoint.service';
import { GridColSizeService } from '@orda.shared/services/gridcolsize.service';
import { Location } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'orda-order',
	imports: [MatGridListModule, MatRipple, RouterModule, MatIcon],
	template: `
		<h1>Bestellseiten</h1>
		@let views = viewService.views.value() ?? [];
		@if (views.length === 0) {
			<p>No views available</p>
		} @else {
			<mat-grid-list [cols]="gridCols()" rowHeight="1:1" gutterSize="0.5rem">
				<mat-grid-tile mat-ripple (click)="navigateBack()" [colspan]="1" [rowspan]="1">
					<div class="tile-content">
						<mat-icon aria-hidden="false"> arrow_back </mat-icon>
						<span class="tile-text">Zurück</span>
					</div>
				</mat-grid-tile>
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
		h1 {
			margin-top: 5vh;
		}

		.container {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			align-content: center;
		}

		.title {
			font-size: 1.75em;
			font-weight: 500;
		}

		.cnt {
			font-weight: 300;
			color: grey;
		}

		mat-icon {
			height: 3rem;
			width: 3rem;
			font-size: 3rem;
		}

		.tile-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
		}

		.tile-text {
			margin-top: 0.25rem;
			font-size: 1.25rem;
		}
	`,
})
export class OrderComponent {
	viewService = inject(OrderService);
	breakpointService = inject(ViewBreakpointService);

	gridCols = inject(GridColSizeService).size;

	constructor(private _location: Location) {
		this.viewService.views.reload();
	}

	navigateBack() {
		this._location.back();
	}
}
