import { Component, effect, inject, input, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from '@orda.features/order/components/order-grid/order-grid.component';
import { CartComponent } from '@orda.features/order/components/cart/cart.component';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { KeyValuePipe } from '@angular/common';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { GridColSizeService } from '@orda.shared/services/gridcolsize.service';
import { ViewBreakpointService } from '@orda.shared/services/view-breakpoint.service';
import { CartMobileComponent } from '@orda.features/order/components/cart-mobile/cart-mobile.component';

@Component({
	selector: 'orda-order-desktop',
	imports: [MatTabsModule, OrderGridComponent, CartComponent, KeyValuePipe, CartMobileComponent],
	template: `
		<div class="container" [class]="viewClass()">
			<mat-tab-group mat-stretch-tabs class="products" animationDuration="0ms">
				@let obj = data.value();
				@if (obj !== undefined) {
					@let productsMap = obj.products;
					@for (group of productsMap | keyvalue; track group.key) {
						@let products = group.value;
						@if (products.length > 0) {
							<mat-tab [label]="groupName(group.key)" style="scrollbar-width: none;">
								<orda-order-grid
									[products]="products"
									[deposit]="obj.deposits ? obj.deposits[group.key] : undefined"
									[style.margin.rem]="0.5"
									[gridCols]="gridCols()"
								/>
							</mat-tab>
						}
					} @empty {
						<div>Leer</div>
					}
				}
			</mat-tab-group>
			@if (!isMobilePortrait()) {
				<orda-cart class="cart" [style.flex-basis]="cartSize()" [view_id]="view()" />
			} @else {
				<orda-cart-mobile class="cart" [view_id]="view()" />
			}
		</div>
	`,
	styles: `
		mat-tab-group {
			scrollbar-width: thin;
		}

		.container {
			display: flex;
			justify-content: space-between;
			gap: 0.25rem;
			height: calc(100vh - 68px);
		}

		.portrait {
			flex-direction: column;
			height: calc(100vh - 64px);
		}

		.products {
			flex-grow: 1;
			flex-basis: fit-content;
			overflow: hidden;
		}

		.cart {
			background-color: #f5ebe070;
		}
	`,
})
export class OrderDesktopComponent {
	view = input.required<string>();

	orderService = inject(OrderService);
	assortmentService = inject(AssortmentService);

	data = rxResource({
		request: () => this.view(),
		loader: ({ request }) => this.orderService.getViewProducts(request),
	});

	gridCols = inject(GridColSizeService).size;
	cartSize = signal<string>('18.5em');
	viewClass = signal<string>('desktop-container');
	isMobilePortrait = signal<boolean>(false);

	viewBreakpoints = toSignal(inject(ViewBreakpointService).getBreakpoint());

	constructor() {
		effect(() => {
			const breakpoint = this.viewBreakpoints();
			switch (breakpoint) {
				case 'XSmall':
				case 'Small':
					this.viewClass.set('portrait');
					this.isMobilePortrait.set(true);
					break;
				case 'Medium':
					this.viewClass.set('');
					this.isMobilePortrait.set(false);
					this.cartSize.set('17.5em');
					break;
				case 'Large':
					this.viewClass.set('');
					this.isMobilePortrait.set(false);
					this.cartSize.set('22em');
					break;
			}
		});
	}

	groupName(id: string) {
		return (
			this.assortmentService.groups.value()?.find((group) => group.id === id)?.name ?? 'unknown'
		);
	}
}
