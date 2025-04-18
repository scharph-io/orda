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

@Component({
	selector: 'orda-order-desktop',
	imports: [MatTabsModule, OrderGridComponent, CartComponent, KeyValuePipe],
	template: `
		<div [class]="viewClass()">
			<mat-tab-group mat-stretch-tabs class="products" animationDuration="0ms">
				@let obj = data.value();
				@if (obj !== undefined) {
					@let productsMap = obj.products;
					@for (group of productsMap | keyvalue; track group.key) {
						@let products = group.value;
						@if (products.length > 0) {
							<mat-tab [label]="groupName(group.key)">
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
			<orda-cart class="cart" [style.flex-basis]="cartSize()" [view_id]="view()" />
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
			height: calc(100vh - 62px);
			.cart {
				height: 10rem;
			}
		}

		.products {
			flex-grow: 1;
			flex-basis: fit-content;
			overflow: hidden;
		}

		.cart {
			background-color: rgba(21, 94, 149, 0.2);
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
					this.viewClass.set('desktop-container-vert');
					this.isMobilePortrait.set(true);
					this.cartSize.set('1rem');
					break;
				case 'Medium':
					this.viewClass.set('desktop-container');
					this.isMobilePortrait.set(false);
					this.cartSize.set('17.5em');
					break;
				case 'Large':
					this.viewClass.set('desktop-container');
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
