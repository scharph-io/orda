import { Component, effect, inject, input, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from '@orda.features/order/components/order-grid/order-grid.component';
import { CartComponent } from '@orda.features/order/components/cart/cart.component';
import { Subject } from 'rxjs';
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
									[gridCols]="gridCols()"
								/>
							</mat-tab>
						}
					} @empty {
						<div>Empty</div>
					}
				}
			</mat-tab-group>
			<orda-cart class="cart" [style.flex-basis]="cartSize()" />
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
export class OrderDesktopComponent {
	view = input.required<string>();

	orderService = inject(OrderService);
	assortmentService = inject(AssortmentService);

	data = rxResource({
		request: () => this.view(),
		loader: ({ request }) => this.orderService.getViewProducts(request),
	});

	gridCols = inject(GridColSizeService).size;
	cartSize = signal<string>('17.5em');
	viewClass = signal<string>('desktop-container');
	isMobilePortrait = signal<boolean>(false);

	viewBreakpoints = toSignal(inject(ViewBreakpointService).getBreakpoint());

	destroyed$ = new Subject<void>();

	constructor() {
		effect(() => {
			const breakpoint = this.viewBreakpoints();
			switch (breakpoint) {
				case 'XSmall':
				case 'Small':
					this.viewClass.set('desktop-container-vert');
					this.cartSize.set('17.5em');
					break;
				case 'Medium':
				case 'Large':
				case 'XLarge':
					this.viewClass.set('desktop-container');
					this.cartSize.set('17.5em');
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
