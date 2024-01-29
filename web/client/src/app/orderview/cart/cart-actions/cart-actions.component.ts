import { Component, inject, input } from '@angular/core';
import { CartItem, CartStore } from '../cart.store';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'orda-cart-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="container">
    @if (items().length > 0) {
      <button mat-icon-button color="warn" (click)="clearCart()">
        <mat-icon>remove_shopping_cart</mat-icon>
      </button>
    }
      <button mat-flat-button color="primary" [disabled]="disableCheckout()">
        Checkout
      </button>

    </div>
  `,
  styles: `
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 2.5em;
      font-size: 1.5em;
      font-weight: bold;
    }

    mat-icon button {
      font-size: 0.7em
    }
  `,
})
export class CartActionsComponent {
  items = input.required<CartItem[]>();
  cart = inject(CartStore);

  clearCart(): void {
    this.cart.clear();
  }

  disableCheckout(): boolean {
    return this.items().length === 0;
  }
}
