import { Component, inject, input } from '@angular/core';
import { CartItem, CartStore } from '../cart.store';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutDialogComponent } from './cart-checkout-dialog.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'orda-cart-actions',
    imports: [MatButtonModule, MatIconModule, TranslocoModule],
    template: `
    @if (items().length > 0) {
      <button class="item-0" mat-icon-button color="warn" (click)="clearCart()">
        <mat-icon>delete_forever</mat-icon>
      </button>
    }
    <button
      class="item-1"
      mat-flat-button
      color="primary"
      [disabled]="items().length === 0"
      (click)="openCheckoutDialog()"
    >
      <mat-icon>shopping_cart_checkout</mat-icon>
      {{ 'cart.checkout' | transloco }}
    </button>
  `,
    styles: `
    :host {
      display: flex;
      flex-direction: row;
      height: 3.5em;
      width: 100%;
      gap: 0.25em;
    }

    button {
      font-size: 1.1em;
      width: 100%;
      height: 100%;
    }

    // mat-icon button {
    //   font-size: 0.5em;
    // }
  `
})
export class CartActionsComponent {
  items = input.required<CartItem[]>();
  cart = inject(CartStore);
  dialog = inject(MatDialog);

  clearCart(): void {
    this.cart.clear();
  }

  openCheckoutDialog() {
    const dialogRef = this.dialog.open(CheckoutDialogComponent, {
      data: this.items(),
      width: 'auto',
      minWidth: '25rem',
      height: '25rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');

      if (result && (result.clear as boolean)) {
        this.clearCart();
      }
    });
  }
}
