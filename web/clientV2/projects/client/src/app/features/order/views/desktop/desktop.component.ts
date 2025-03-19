import { Component, input } from '@angular/core';
import { View } from '@orda.core/models/view';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from '@orda.features/order/components/order-grid/order-grid.component';
import { CartComponent } from '@orda.features/order/components/cart/cart.component';

@Component({
	selector: 'orda-order-desktop',
	imports: [MatTabsModule, OrderGridComponent, CartComponent],
	template: ` <div class="desktop-container">
		<mat-tab-group
			class="products"
			mat-align-tabs="center"
			animationDuration="0ms"
			dynamicHeight="false"
		>
			@for (v of views(); track v.id) {
				@if (v.products && v.products.length > 0) {
					<mat-tab [label]="v.name ?? ''">
						<orda-order-grid [view]="v" [style.margin.em]="0.5" />
					</mat-tab>
				}
			}
		</mat-tab-group>
		<orda-cart class="cart" [style.flex-basis]="'25em'" />
	</div>`,
	styles: `
		.desktop-container {
			display: flex;
			justify-content: space-between;
			height: calc(100vh - 64px);
		}

		.products {
			flex-grow: 1;
			flex-basis: fit-content;
		}

		.cart {
			background-color: lightgray;
		}
	`,
})
export class OrderDesktopComponent {
	views = input.required<Partial<View>[]>();
}
