import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {
	CheckoutRequest,
	CheckoutRequestItem,
	CheckoutService,
} from '@orda.features/data-access/services/checkout.service';
import { CartItem, OrderStoreService } from '@orda.features/order/services/order-store.service';
import { PaymentOption, PaymentOptionKeys } from '@orda.features/order/utils/transaction';
import { AccountService } from '@orda.features/data-access/services/account/account.service';
import { Account } from '@orda.core/models/account';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { KeyValuePipe } from '@angular/common';

export interface CheckoutDialogData {
	message: string;
	disableSubmit?: boolean;
}

@Component({
	selector: 'orda-cart-checkout-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		OrdaCurrencyPipe,
		MatButtonToggleModule,
		MatDialogModule,
		MatButtonModule,
		MatSelectModule,
		KeyValuePipe,
	],
	template: `
		<!--		<h2 mat-dialog-title>Checkout</h2>-->
		<mat-dialog-content class="container">
			@let totalSum = total() ?? 0;
			<div class="total">
				<div class="total-container">
					<div class="item-0">
						{{ totalSum | currency: 'EUR' }}
					</div>
					<div class="item-1">{{ 'Summe' }}:</div>
					<!--					<div class="item-1">{{ 'cart.total' }}:</div>-->
				</div>
			</div>

			<div class="payment">
				<mat-button-toggle-group [formControl]="paymentOptionControl" aria-label="Payment option">
					<mat-button-toggle [value]="PaymentOption.CASH">{{
						PaymentOptionKeys[PaymentOption.CASH]
					}}</mat-button-toggle>
					@if (totalSum > 0) {
						<mat-button-toggle [value]="PaymentOption.FREE">{{
							PaymentOptionKeys[PaymentOption.FREE]
						}}</mat-button-toggle>
						<mat-button-toggle [value]="PaymentOption.SPONSOR">{{
							PaymentOptionKeys[PaymentOption.SPONSOR]
						}}</mat-button-toggle>
						<mat-button-toggle [value]="PaymentOption.ACCOUNT">{{
							PaymentOptionKeys[PaymentOption.ACCOUNT]
						}}</mat-button-toggle>
					}
				</mat-button-toggle-group>
			</div>
			@if (paymentOptionControl.value === PaymentOption.ACCOUNT) {
				<div class="account">
					<mat-form-field class="example-full-width">
						<!--						<mat-label>{{ 'checkout.account' }}</mat-label>-->
						<mat-label>{{ 'Konto' }}</mat-label>
						<mat-select [formControl]="accountControl">
							<!--							<mat-option>&#45;&#45; None &#45;&#45;</mat-option>-->
							@for (group of accountMap() | keyvalue; track group.key) {
								<mat-optgroup [label]="group.key">
									@for (acc of group.value; track acc) {
										<mat-option [value]="acc.id" [disabled]="acc.credit_balance <= 0"
											>{{ acc.lastname }} {{ acc.firstname }}
										</mat-option>
									}
								</mat-optgroup>
							}
						</mat-select>
					</mat-form-field>
				</div>
				@if (selectedAccount() && error === '') {
					@let balance = selectedAccount()?.credit_balance ?? 0;
					@if (diff() > 0) {
						<div class="info" [style.color]="'green'">
							{{ balance | currency }} - {{ total() | currency }} =
							{{ diff() | currency }}
						</div>
					} @else {
						@if (balance > 0) {
							<div class="info" [style.color]="'#ef233c'">
								{{ balance | currency }} - {{ total() | currency }} =
								{{ diff() | currency }}
								<div class="remain">{{ 'Restbetrag bar' }} {{ diff() * -1 | currency }}</div>
								<!--								<div>{{ 'checkout.cash-remain' }} {{ diff() * -1 | currency }}</div>-->
							</div>
						} @else {
							<!--							<div class="error" [style.color]="'red'">{{ 'checkout.account-empty' }}</div>-->
							<div class="info" [style.color]="'red'">{{ 'Konto leer' }}</div>
						}
					}
				}
			}
			<div class="error" [style.color]="'red'">{{ error }}</div>
		</mat-dialog-content>
		<mat-dialog-actions align="end" class="btn-flex-container">
			<!--			<button mat-button [mat-dialog-close]="-1" cdkFocusInitial>{{ 'checkout.cancel' }}</button>-->
			<div class="btn-container">
				<button class="cancel" mat-fab extended [mat-dialog-close]="0" cdkFocusInitial>
					{{ 'Abbrechen' }}
				</button>
			</div>
			<div class="btn-container">
				@switch (paymentOptionControl.value) {
					@case (PaymentOption.CASH) {
						<button
							class="checkout"
							mat-fab
							extended
							cdkFocusInitial
							(click)="checkout(data.view_id)"
						>
							<!--						{{ 'checkout.cash.title' }}-->
							{{ 'Bar' }}
						</button>
					}
					@case (PaymentOption.ACCOUNT) {
						@let balance = selectedAccount()?.credit_balance ?? 0;
						<button
							class="checkout"
							mat-fab
							extended
							[disabled]="!accountControl.value || balance === 0"
							(click)="checkout(data.view_id, PaymentOption.ACCOUNT, selectedAccount()?.id)"
						>
							<!--						{{ 'checkout.account.title' }}-->
							{{ 'Konto' }}
						</button>
					}
					@case (PaymentOption.FREE) {
						<button
							class="checkout"
							mat-fab
							extended
							cdkFocusInitial
							(click)="checkout(data.view_id, PaymentOption.FREE)"
						>
							<!--						{{ 'checkout.cash.title' }}-->
							{{ 'Frei' }}
						</button>
					}

					@case (PaymentOption.SPONSOR) {
						<button
							class="checkout"
							mat-fab
							extended
							cdkFocusInitial
							(click)="checkout(data.view_id, PaymentOption.SPONSOR)"
						>
							<!--						{{ 'checkout.cash.title' }}-->
							{{ 'Sponsor' }}
						</button>
					}
				}
			</div>
		</mat-dialog-actions>
	`,
	styles: `
		.container {
			display: grid;
			gap: 0.5rem;
			grid-template:
				'total' 10rem
				'payment' auto
				'account' auto
				'info' 3rem/1fr;
		}

		.total {
			font-size: 1.5rem;
			justify-self: center;
			align-self: center;
			grid-area: total;
		}

		.account {
			font-size: 1.2rem;
			justify-self: center;
			grid-area: account;
		}

		.payment {
			font-size: 1.2rem;
			justify-self: center;
			grid-area: payment;
		}

		.info {
			justify-self: center;
			grid-area: info;
			font-size: 1.2rem;
			text-align: center;
		}

		.total-container {
			display: flex;
			gap: 0.5em;
			flex-direction: row-reverse;
		}

		.item-1 {
			font-size: 1.15em;
			flex-grow: 1;
			align-self: center;
		}

		.item-0 {
			font-size: 2em;
			font-weight: bold;
			flex-grow: 2;
			flex-basis: 1rem;
			align-self: center;
		}

		.btn-flex-container {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
		}

		.btn-container {
			display: flex;
			justify-content: center;
			width: 9rem;
		}

		.cancel {
			font-size: 1.1rem;
			background-color: #e63946;
			color: white;
		}

		.checkout {
			font-size: 1.1rem;
			background-color: #2a9134;
			color: white;
			min-width: 9rem;
		}

		.remain {
			font-size: 1.2rem;
			font-weight: bold;
			color: red;
			line-height: 2rem;
			letter-spacing: 0.15rem;
		}
	`,
})
export class CartCheckoutDialogComponent {
	cart = inject(OrderStoreService);
	accountService = inject(AccountService);
	checkoutService = inject(CheckoutService);

	public accounts = rxResource({
		loader: () => this.accountService.read(),
	});

	items = toSignal(this.cart.items$);
	total = toSignal(this.cart.subtotal$);
	totalQty = toSignal(this.cart.totalQty$);

	data = inject<{ view_id: string }>(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<CartCheckoutDialogComponent, number> = inject(MatDialogRef);

	accountControl = new FormControl('');
	paymentOptionControl = new FormControl(PaymentOption.CASH, [Validators.required]);

	changed = toSignal(this.accountControl.valueChanges);

	accountMap = computed(() => {
		return this.groupAndSortByLastnameInitial(this.accounts.value() ?? []);
	});

	selectedAccount = computed(() => {
		return this.accounts.value()?.find((a) => a.id === (this.changed() ?? ''));
	});

	diff = computed(() => {
		return (this.selectedAccount()?.credit_balance ?? 0) - (this.total() ?? 0);
	});

	error = '';

	PaymentOption = PaymentOption;
	PaymentOptionKeys = PaymentOptionKeys;

	checkout(view_id: string, option = PaymentOption.CASH, account_id?: string) {
		this.error = '';

		const checkoutData = {
			payment_option: option,
			account_id,
			view_id,
			items:
				this.items()?.map(
					(i: CartItem) => ({ id: i.id, qty: i.quantity }) as CheckoutRequestItem,
				) ?? [],
		} as CheckoutRequest;

		this.checkoutService.checkout(checkoutData).subscribe({
			next: () => {
				this.dialogRef.close(1);
			},
			error: (err) => {
				console.log(err);
				this.dialogRef.close(-1);
			},
		});
	}

	groupAndSortByLastnameInitial(persons: Account[]): Record<string, Account[]> {
		// 1. Build the raw groups
		const groups = persons.reduce<Record<string, Account[]>>((acc, p) => {
			const initial = p.lastname.charAt(0).toUpperCase();
			(acc[initial] ||= []).push(p);
			return acc;
		}, {});

		// 2. Sort each group’s array by lastname, then firstname
		for (const initial in groups) {
			groups[initial].sort((a, b) => {
				const lnCmp = a.lastname.localeCompare(b.lastname);
				return lnCmp !== 0 ? lnCmp : a.firstname.localeCompare(b.firstname);
			});
		}

		// 3. Emit a new object with initials in sorted order
		const sortedResult: Record<string, Account[]> = {};
		for (const key of Object.keys(groups).sort()) {
			sortedResult[key] = groups[key];
		}

		return sortedResult;
	}
}
