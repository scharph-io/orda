import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { CartCheckoutDialogComponent } from '@orda.features/order/components/cart/cart-actions/dialogs/cart-checkout-dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

@Component({
  selector: 'orda-cart-actions',
  imports: [MatButtonModule, MatIconModule],
  providers: [OrdaCurrencyPipe],
  template: `
    @let items = cartItems() ?? [];

    <div class="flex items-center gap-3 w-full">
      @if (items.length > 0) {
        <button
          mat-icon-button
          (click)="clearCart()"
          class="!text-gray-500 hover:!text-red-600 hover:bg-red-50 transition-colors"
          title="Warenkorb leeren"
        >
          <mat-icon>delete_forever</mat-icon>
        </button>
      }

      <button
        mat-flat-button
        [disabled]="items.length === 0"
        (click)="openCheckoutDialog()"
        class="flex-1 !h-14 !rounded-xl !text-lg !font-bold transition-all shadow-sm"
        [class]="
          items.length === 0
            ? '!bg-gray-100 !text-gray-400'
            : '!bg-blue-700 !text-white hover:!bg-blue-800'
        "
      >
        <div class="flex items-center justify-center gap-2">
          <mat-icon class="scale-110">shopping_cart_checkout</mat-icon>
          <span>Abrechnen</span>
        </div>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class CartActionsComponent {
  cart = inject(OrderStoreService);
  view_id = input.required<string>();
  dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  subtotal = toSignal(this.cart.subtotal$);

  private readonly currencyP = inject(OrdaCurrencyPipe);

  cartItems = toSignal(this.cart.items$);

  clearCart(): void {
    this.cart.clear();
  }

  openCheckoutDialog() {
    const dialogRef = this.dialog.open<CartCheckoutDialogComponent, { view_id: string }, number>(
      CartCheckoutDialogComponent,
      {
        data: {
          view_id: this.view_id(),
        },
        disableClose: true,
        // Optional: Ensure the dialog looks nice on mobile
        panelClass: 'responsive-dialog-container',
        minWidth: '350px',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result > 0) {
        this.snackBar.open(`${this.currencyP.transform(this.subtotal())} gebucht`, undefined, {
          duration: 1500,
        });
        this.clearCart();
      } else if (result === 0) {
        this.snackBar.open('Bezahlung abgebrochen', undefined, {
          duration: 2000,
          politeness: 'assertive',
        });
      } else {
        // Handle error or other states
      }
    });
  }
}
