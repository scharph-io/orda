import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CartSubtotalComponent } from '../cart-subtotal/cart-subtotal.component';
import { CartStore } from '../cart.store';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutDialogComponent } from '../cart-actions/cart-checkout-dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartDialogComponent } from './cart-dialog.component';

@Component({
  selector: 'orda-cart-footer',
  standalone: true,
  template: `
    @if (totalQty$ | async) {
      <button class="item-0" mat-icon-button color="warn" (click)="clearCart()">
        <mat-icon>delete_forever</mat-icon>
      </button>
    }
    <orda-cart-subtotal
      [subtotal]="(subtotal$ | async) ?? 0"
    ></orda-cart-subtotal>
    <button
      mat-icon-button
      color="info"
      (click)="openCartDialog()"
      [disabled]="data()?.length === 0"
    >
      <mat-icon
        [matBadge]="totalQty$ | async"
        matBadgeColor="warn"
        aria-hidden="false"
        >shopping_cart</mat-icon
      >
    </button>
    <button
      class="item-1"
      mat-flat-button
      color="primary"
      [disabled]="data()?.length === 0"
      (click)="openCheckoutDialog()"
    >
      <mat-icon>shopping_cart_checkout</mat-icon>
      {{ 'cart.checkout' | transloco }}
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: lightgray;
        border-top: 1px solid black;
      }
    `,
  ],
  imports: [
    CartSubtotalComponent,
    AsyncPipe,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    TranslocoModule,
    CartDialogComponent,
  ],
})
export class CartFooterComponent {
  cartStore = inject(CartStore);
  dialog = inject(MatDialog);
  data = toSignal(this.cartStore.items$);

  get subtotal$() {
    return this.cartStore.subtotal$;
  }

  get totalQty$() {
    return this.cartStore.totalQty$;
  }

  clearCart(): void {
    this.cartStore.clear();
  }

  openCheckoutDialog() {
    const dialogRef = this.dialog.open(CheckoutDialogComponent, {
      data: this.data(),
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

  openCartDialog() {
    this.dialog.open(CartDialogComponent, {
      data: this.data(),
      width: 'auto',
      height: '35rem',
    });
  }
}
