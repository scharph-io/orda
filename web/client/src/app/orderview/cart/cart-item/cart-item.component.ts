import { Component, Input, inject, input } from '@angular/core';
import { CartItem, CartStore } from '../cart.store';
import { CurrencyPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'orda-cart-item',
  standalone: true,
  imports: [JsonPipe, CurrencyPipe],
  template: `
    <div class="container">
      <div class="title">{{ item().articleName }}</div>
      <div class="desc"></div>
      <div class="quantity">{{ item().quantity }}</div>
      <div class="sum">
        {{ item().price * item().quantity | currency : 'EUR' }}
      </div>
      <div class="rm"><button (click)="removeItem(item())">-</button></div>
    </div>
  `,
  styles: `

  .container {
    display: grid;
    gap: 0px 0.25em;
    grid-auto-flow: row;
    grid-template:
      "title quantity sum rm" 1fr
      "desc quantity sum rm" 1fr / 2fr 1fr 1fr 0.3fr;
    height: 3em;
  }

  .title { grid-area: title; }

  .desc { grid-area: desc; }

  .quantity {
    grid-area: quantity;
  }

  .sum { grid-area: sum; }

  .rm { grid-area: rm; }
`,
})
export class CartItemComponent {
  public item = input.required<CartItem>();

  cartStore = inject(CartStore);

  removeItem(item: CartItem): void {
    this.cartStore.removeItem(item);
  }
}
