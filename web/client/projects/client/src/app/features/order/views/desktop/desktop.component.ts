import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from '@orda.features/order/components/order-grid/order-grid.component';
import { CartComponent } from '@orda.features/order/components/cart/cart.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { KeyValuePipe } from '@angular/common';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';

@Component({
	selector: 'orda-order-desktop',
	imports: [MatTabsModule, OrderGridComponent, CartComponent, KeyValuePipe],
	template: `
		<div [class]="viewClass">
			<mat-tab-group
				class="products"
				mat-align-tabs="center"
				animationDuration="0ms"
				dynamicHeight="false"
			>
				@let obj = data.value();
				@if (obj !== undefined) {
					@let productsMap = obj.products;
					@for (group of productsMap | keyvalue; track group.key) {
						@let products = group.value;
						@if (products.length > 0) {
							<mat-tab [label]="groupName(group.key)">
								<orda-order-grid
									[products]="products"
									[deposit]="obj.deposits !== undefined ? obj.deposits[group.key] : undefined"
									[style.margin.rem]="0.5"
									[gridCols]="gridCols"
								/>
							</mat-tab>
						}
					} @empty {
						<div>Empty</div>
					}
				}
			</mat-tab-group>
			<orda-cart class="cart" [style.flex-basis]="cartSize" />
		</div>
	`,
	styles: `
		.desktop-container {
			display: flex;
			justify-content: space-between;
			gap: 0.25rem;
			height: calc(100vh - 72px);
		}

		.desktop-container-vert {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			gap: 0.25rem;
			height: calc(100vh - 72px);
		}

		.products {
			flex-grow: 1;
			flex-basis: fit-content;
		}

		.cart {
			background-color: lightgray;
			/*width: 17rem;*/
		}
	`,
})
export class OrderDesktopComponent implements OnInit {
	view = input.required<string>();

	orderService = inject(OrderService);
	assortmentService = inject(AssortmentService);

	data = rxResource({
		request: () => this.view(),
		loader: ({ request }) => this.orderService.getViewProducts(request),
	});

	cartSize?: string;
	viewClass = 'desktop-container';

	isMobilePortrait = signal<boolean>(false);
	gridCols = 3;

	destroyed$ = new Subject<void>();

	constructor(private responsive: BreakpointObserver) {}

	ngOnInit() {
		this.cartSize = '30em';
		this.responsive
			.observe([
				Breakpoints.HandsetPortrait,
				Breakpoints.Small,
				Breakpoints.Medium,
				Breakpoints.Large,
				Breakpoints.XLarge,
			])
			.pipe(takeUntil(this.destroyed$))
			.subscribe((result) => {
				const breakpoints = result.breakpoints;
				this.isMobilePortrait.set(false);
				if (breakpoints[Breakpoints.Small]) {
					console.log('screens matches Small');
					this.viewClass = 'desktop-container';
					this.cartSize = '10em';
					this.gridCols = 6;
				} else if (breakpoints[Breakpoints.Medium]) {
					console.log('screens matches Medium');
					this.viewClass = 'desktop-container';
					this.cartSize = '15em';
					this.gridCols = 6;
				} else if (breakpoints[Breakpoints.Large]) {
					console.log('screens matches Large');
					this.viewClass = 'desktop-container';
					this.cartSize = '17.5em';
					this.gridCols = 8;
				} else if (breakpoints[Breakpoints.XLarge]) {
					console.log('screens matches XLarge');
					this.viewClass = 'desktop-container';
					this.cartSize = '20em';
					this.gridCols = 8;
				} else if (breakpoints[Breakpoints.HandsetPortrait]) {
					console.log('screens matches HandsetPortrait');
					this.viewClass = 'desktop-container-vert';
					this.isMobilePortrait.set(true);
					this.cartSize = '2em';
					this.gridCols = 2;
				}
			});
	}

	groupName(id: string) {
		return (
			this.assortmentService.groups.value()?.find((group) => group.id === id)?.name ?? 'unknown'
		);
	}

}
