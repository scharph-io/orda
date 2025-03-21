import { Component, inject } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { CartCheckoutDialogComponent } from '@orda.features/order/components/cart/cart-actions/dialogs/cart-checkout-dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'orda-cart-actions',
	imports: [MatButtonModule, MatIconModule],
	template: `
		@let items = cartItems() ?? [];
		@if (items.length > 0) {
			<button class="item-0" mat-icon-button color="warn" (click)="clearCart()">
				<mat-icon>delete_forever</mat-icon>
			</button>
		}
		<button
			class="item-1"
			mat-flat-button
			color="primary"
			[disabled]="items.length === 0"
			(click)="openCheckoutDialog()"
		>
			<mat-icon>shopping_cart_checkout</mat-icon>
			{{ 'cart.checkout' }}
		</button>
	`,
	styles: `
		:host {
			display: flex;
			/* flex-direction: row;
			// height: 3.5em;
			// width: 100%;
			// gap: 0.25em; */
		}

		/* button {
		// 	font-size: 1.1em;
		// 	width: 100%;
		// 	height: 100%;
		// } */
	`,
})
export class CartActionsComponent {
	cart = inject(OrderStoreService);
	dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);


  cartItems = toSignal(this.cart.items$);

	clearCart(): void {
		this.cart.clear();
	}

	openCheckoutDialog() {
		const dialogRef = this.dialog.open<CartCheckoutDialogComponent, undefined, number>(
			CartCheckoutDialogComponent,
			{
				width: 'auto',
				minWidth: '25rem',
				height: '25rem',
			},
		);

		dialogRef.afterClosed().subscribe((result) => {
			console.log('The dialog was closed', result);

      this.snackBar.open(`Checkout result: ${result}`, undefined, {
        duration: 5000,
      });
			if (result && result > 0) {
				this.clearCart();
			}
		});
	}


}
