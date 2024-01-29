import { Component, Input, computed, inject, input, signal } from '@angular/core';
import { CartItem, CartStore } from '../cart.store';
import { CurrencyPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'orda-cart-item',
  standalone: true,
  imports: [JsonPipe, CurrencyPipe],
  template: `
    <div [class]="containerClass()">
      <div class="title">{{ item().articleName }}</div>
      @if (item().desc) {
        <div class="desc">{{item().desc}}</div>
      }
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
      "title quantity sum rm" 1fr / 2fr 1fr 1fr 0.3fr;
    height: 2em;
  }

  .container-with-desc {
    display: grid;
    gap: 0px 0.25em;
    grid-auto-flow: row;
    grid-template:
      "title quantity sum rm" 1fr
      "desc quantity sum rm" 1fr / 2fr 1fr 1fr 0.3fr;
    height: 3em;
  }

  .title {
    grid-area: title;
    display: flex;
    align-items: center;
  }

  .title-with-desc {
    grid-area: title;
    border-color: red;
  }

  .desc { grid-area: desc; }

  .quantity {
    grid-area: quantity;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sum {
    grid-area: sum;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rm {
    grid-area: rm;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`,
})
export class CartItemComponent {
  item = input.required<CartItem>();

  containerClass = computed(() => {
    if (this.item().desc) {
      return "container-with-desc";
    } else {
      return "container";
    }
  });

  cartStore = inject(CartStore);

  removeItem(item: CartItem): void {
    this.cartStore.removeItem(item);
  }
}
