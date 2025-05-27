import { Component, inject, input, Signal } from '@angular/core';
import { CartItem, OrderStoreService } from '@orda.features/order/services/order-store.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartCheckoutDialogComponent } from '@orda.features/order/components/cart/cart-actions/dialogs/cart-checkout-dialog.component';
import { CartItemComponent } from '@orda.features/order/components/cart/cart-item/cart-item.component';

@Component({
	selector: 'orda-cart-mobile',
	imports: [MatIconButton, MatIcon, MatButton, MatBadge, OrdaCurrencyPipe],
	providers: [OrdaCurrencyPipe],
	template: `
		<button class="item-0" mat-icon-button color="warn" (click)="cart.clear()">
			<mat-icon>delete_forever</mat-icon>
		</button>
		<div class="spacer"></div>
		<button
			class="item-0"
			mat-icon-button
			[disabled]="items()?.length === 0"
			(click)="openCartOverviewDialog()"
		>
			<mat-icon aria-hidden="false" [matBadge]="totalQty()">shopping_cart</mat-icon>
		</button>
		<button
			class="item-1"
			mat-flat-button
			color="primary"
			[disabled]="items()?.length === 0"
			(click)="openCheckoutDialog()"
		>
			{{ subtotal() | currency: 'EUR' }}
			<mat-icon>shopping_cart_checkout</mat-icon>
		</button>
	`,
	styles: `
		:host {
			min-height: 4rem;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: row;
			gap: 0.25rem;
			padding: 0 1rem;
		}

		button {
			&.item-1 {
				height: 3rem;
				width: 12rem;
				font-size: 1.25rem;
			}
		}

		.spacer {
			flex-grow: 1;
		}
	`,
})
export class CartMobileComponent {
	cart = inject(OrderStoreService);

	view_id = input.required<string>();

	items = toSignal(this.cart.items$);
	subtotal = toSignal(this.cart.subtotal$);
	totalQty = toSignal(this.cart.totalQty$);

	private readonly dialog = inject(MatDialog);
	private readonly snackBar = inject(MatSnackBar);

	currencyP = inject(OrdaCurrencyPipe);

	openCheckoutDialog() {
		const dialogRef = this.dialog.open<CartCheckoutDialogComponent, { view_id: string }, number>(
			CartCheckoutDialogComponent,
			{
				width: '95%',
				minWidth: '25rem',
				height: '25rem',
				data: {
					view_id: this.view_id(),
				},
				disableClose: true,
			},
		);

		dialogRef.afterClosed().subscribe((result) => {
			if (result && result > 0) {
				this.snackBar.open(`${this.currencyP.transform(this.subtotal())} gebucht`, undefined, {
					duration: 2500,
				});
				this.cart.clear();
			} else if (result === 0) {
				this.snackBar.open('Bezahlung abgebrochen', undefined, {
					duration: 1500,
				});
			} else {
				this.snackBar.open('Bezahlung abgebrochen', undefined, {
					duration: 3000,
				});
			}
		});
	}

	openCartOverviewDialog() {
		const dialogRef = this.dialog.open<
			CartMobileOverviewComponent,
			Signal<CartItem[] | undefined>,
			undefined
		>(CartMobileOverviewComponent, {
			width: 'auto',
			minWidth: '20rem',
			height: '25rem',
			data: this.items,
		});

		dialogRef.afterClosed().subscribe(() => undefined);
	}
}

@Component({
	selector: 'orda-cart-mobile-overview',
	imports: [MatDialogContent, MatDialogActions, MatButton, CartItemComponent],
	template: `
		<mat-dialog-content>
			@for (item of data(); track $index) {
				<orda-cart-item [item]="item"></orda-cart-item>
			} @empty {
				<span class="cartEmpty">{{ 'Warenkorb leer' }}</span>
			}
		</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-button (click)="dialogRef.close()">Schließen</button>
		</mat-dialog-actions>
	`,
	styles: ``,
})
export class CartMobileOverviewComponent {
	data = inject<Signal<CartItem[]>>(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<CartMobileOverviewComponent, undefined> = inject(MatDialogRef);
}
