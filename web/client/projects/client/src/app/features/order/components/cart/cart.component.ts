import { Component, inject } from '@angular/core';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartActionsComponent } from '@orda.features/order/components/cart/cart-actions/cart-actions.component';
import { CartSubtotalComponent } from '@orda.features/order/components/cart/cart-subtotal/cart-subtotal.component';
import { CartItemComponent } from '@orda.features/order/components/cart/cart-item/cart-item.component';

@Component({
	selector: 'orda-cart',
	imports: [CartActionsComponent, CartSubtotalComponent, CartItemComponent],
	template: `
		<div class="cart">
			@for (item of items(); track $index) {
				<orda-cart-item [item]="item"></orda-cart-item>
			}
			@if (items()?.length === 0) {
				<span class="cartEmpty">{{ 'Warenkorb leer' }}</span>
			}
		</div>

		<orda-cart-subtotal class="subtotal" [subtotal]="subtotal() ?? 0" />
		<orda-cart-actions class="actions" />
	`,
	styles: `
		:host {
			// padding: 1em;
			display: grid;
			// gap: 0.5em;
			grid-auto-flow: row;
			justify-content: center;
			align-content: stretch;
			align-items: stretch;
			padding: 0.25rem;
			grid-template:
				'cart' 1fr
				'subtotal' min-content
				'actions' min-content/ 1fr;
		}

		.cart {
			grid-area: cart;
			// height: calc(100vh - 13em);
			height: 80vh;
			overflow-y: auto;
		}

		.actions {
			justify-self: center;
			align-self: start;
			grid-area: actions;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.title {
			justify-self: center;
			align-self: center;
			grid-area: title;
		}

		.subtotal {
			justify-self: center;
			align-self: center;
			grid-area: subtotal;
			height: 3em;
		}

		.cartEmpty {
			display: flex;
			justify-content: center;
		}
	`,
})
export class CartComponent {
	cart = inject(OrderStoreService);

	items = toSignal(this.cart.items$);
	subtotal = toSignal(this.cart.subtotal$);
}
