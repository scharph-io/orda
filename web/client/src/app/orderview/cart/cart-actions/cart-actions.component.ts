import { Component, inject, input } from '@angular/core';
import { CartItem, CartStore } from '../cart.store';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutDialogComponent } from './cart-checkout-dialog.component';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'orda-cart-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslocoModule],
  template: `
    <div class="container">
      @if (items().length > 0) {
        <button mat-icon-button color="warn" (click)="clearCart()">
          <mat-icon>delete_forever</mat-icon>
        </button>
      }
      <button
        mat-flat-button
        color="primary"
        [disabled]="disableCheckout()"
        (click)="openCheckoutDialog()"
      >
        <mat-icon>shopping_cart_checkout</mat-icon>
        {{ 'cart.checkout' | transloco }}
      </button>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      // height: 2.5em;
      // font-size: 1.5em;
      // font-weight: bold;
    }

    // mat-icon button {
    //   font-size: 0.5em;
    // }
  `,
})
export class CartActionsComponent {
  items = input.required<CartItem[]>();
  cart = inject(CartStore);
  dialog = inject(MatDialog);

  clearCart(): void {
    this.cart.clear();
  }

  disableCheckout(): boolean {
    return this.items().length === 0;
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
