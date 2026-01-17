import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatDividerModule } from '@angular/material/divider';
import { CartItem, OrderStoreService } from '@orda.features/order/services/order-store.service';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

@Component({
  selector: 'orda-cart-item',
  imports: [MatButtonModule, MatIconModule, MatDividerModule, OrdaCurrencyPipe],
  template: `
    <div
      class="flex items-center w-full py-1 px-1 border-b border-gray-100 hover:bg-gray-50 transition-colors select-none group"
    >
      <div class="flex-1 flex flex-col overflow-hidden pr-1">
        <span class="font-bold text-gray-900 leading-tight truncate text-[0.95rem]">
          {{ item().name }}
        </span>
        @if (item().desc; as desc) {
          <span class="text-xs text-gray-500 font-medium truncate mt-0.5">
            {{ desc }}
          </span>
        }
      </div>

      <div class="w-10 text-center font-semibold text-gray-800 text-[0.95rem] tabular-nums">
        {{ item().quantity }}
      </div>

      <div class="w-20 text-right font-bold text-gray-900 text-[0.95rem] tabular-nums">
        {{ item().price * item().quantity | currency: 'EUR' }}
      </div>

      <div
        role="button"
        tabindex="0"
        (click)="removeItem(item())"
        class="ml-1 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full cursor-pointer transition-all"
        title="Entfernen"
      >
        <mat-icon class="!w-5 !h-5 !text-[1.25rem] leading-none">delete</mat-icon>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartStore = inject(OrderStoreService);

  removeItem(item: CartItem): void {
    this.cartStore.removeItem(item);
  }
}
