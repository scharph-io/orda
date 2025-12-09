import { Component, inject, input } from '@angular/core';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartActionsComponent } from '@orda.features/order/components/cart/cart-actions/cart-actions.component';
import { CartSubtotalComponent } from '@orda.features/order/components/cart/cart-subtotal/cart-subtotal.component';
import { CartItemComponent } from '@orda.features/order/components/cart/cart-item/cart-item.component';

@Component({
  selector: 'orda-cart',
  imports: [CartActionsComponent, CartSubtotalComponent, CartItemComponent],
  template: `
    <div class="cart-items">
      @for (item of items(); track $index) {
        <orda-cart-item [item]="item"></orda-cart-item>
      }
      @if (items()?.length === 0) {
        <span class="cartEmpty">{{ 'Warenkorb leer' }}</span>
      }
    </div>

    <orda-cart-subtotal class="subtotal" [subtotal]="subtotal() ?? 0" />
    <orda-cart-actions class="actions" [view_id]="view_id()" />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-content: center;
    }

    .cart-items {
      flex-grow: 1;
      overflow-y: auto;
      padding: 0.5rem;
    }

    .actions {
      justify-self: center;
      align-self: center;
      height: 4em;
    }

    .subtotal {
      justify-self: center;
      align-self: center;
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

  view_id = input.required<string>();

  items = toSignal(this.cart.items$);
  subtotal = toSignal(this.cart.subtotal$);
}
