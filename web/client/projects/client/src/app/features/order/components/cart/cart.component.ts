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
    <div class="flex flex-col h-full w-full rounded-lg">
      
      <div class="flex-1 overflow-y-auto p-1">
        
        @for (item of items(); track $index) {
          <orda-cart-item [item]="item"></orda-cart-item>
        }
        
        @if (items()?.length === 0) {
          <div class="h-full flex flex-col items-center justify-center text-gray-400 font-medium">
            <span>{{ 'Warenkorb leer' }}</span>
          </div>
        }
      </div>

      <div class="flex-none bg-gray-50 p-2">
        <orda-cart-subtotal class="block mb-4" [subtotal]="subtotal() ?? 0" />
        <orda-cart-actions class="block w-full" [view_id]="view_id()" />
      </div>

    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
})
export class CartComponent {
  cart = inject(OrderStoreService);

  view_id = input.required<string>();

  items = toSignal(this.cart.items$);
  subtotal = toSignal(this.cart.subtotal$);
}
