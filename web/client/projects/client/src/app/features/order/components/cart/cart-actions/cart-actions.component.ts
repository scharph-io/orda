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
		@if (items.length > 0) {
			<button class="item-0" mat-icon-button color="warn" (click)="clearCart()">
				<mat-icon>delete_forever</mat-icon>
			</button>
		}
		<button
			class="item-1"
			mat-flat-button
			[disabled]="items.length === 0"
			(click)="openCheckoutDialog()"
		>
			<mat-icon>shopping_cart_checkout</mat-icon>
			<!--			{{ 'cart.checkout' }}-->
			Abrechnen
		</button>
	`,
	styles: `
		:host {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			gap: 0.5em;
		}

		button {
			&.item-1 {
				height: 3.5rem;
				width: 70%;
				font-size: 1.25rem;
			}
		}
	`,
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
				width: '75%',

				height: '30rem',
				data: {
					view_id: this.view_id(),
				},
				disableClose: true,
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
				this.snackBar.open('Bezahlung abgebrochen', undefined, {
					duration: 3000,
					politeness: 'assertive',
				});
			}
		});
	}
}
