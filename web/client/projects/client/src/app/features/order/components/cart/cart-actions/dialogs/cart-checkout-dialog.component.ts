import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {
	CheckoutRequest,
	CheckoutRequestItem,
	CheckoutService,
} from '@orda.features/order/services/checkout.service';
import { CartItem, OrderStoreService } from '@orda.features/order/services/order-store.service';
import { PaymentOption, PaymentOptionKeys } from '@orda.features/order/utils/transaction';
import { AccountService } from '@orda.features/data-access/services/account/account.service';
import { map, Observable, startWith } from 'rxjs';
import { Account } from '@orda.core/models/account';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';

export interface CheckoutDialogData {
	message: string;
	disableSubmit?: boolean;
}

interface AutoCompleteOption {
	id: string;
	name: string;
	credit: number;
}

@Component({
	selector: 'orda-cart-checkout-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatAutocompleteModule,
		AsyncPipe,
		OrdaCurrencyPipe,
		MatButtonToggleModule,
		MatDialogModule,
		MatButtonModule,
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
					<mat-button-toggle style="background-color: lightgreen" [value]="PaymentOption.CASH">{{
						PaymentOptionKeys[PaymentOption.CASH]
					}}</mat-button-toggle>
					@if (totalSum > 0) {
						<mat-button-toggle style="background-color: lightgoldenrodyellow" [value]="PaymentOption.ACCOUNT">{{
							PaymentOptionKeys[PaymentOption.ACCOUNT]
						}}</mat-button-toggle>
					}
				</mat-button-toggle-group>
			</div>
			@if (paymentOptionControl.value === PaymentOption.ACCOUNT) {
				<div class="account">
					<mat-form-field class="example-full-width">
<!--						<mat-label>{{ 'checkout.account' }}</mat-label>-->
						<mat-label>{{ "Konto" }}</mat-label>
						<input
							type="text"
							placeholder="Account"
							matInput
							[formControl]="accountControl"
							[matAutocomplete]="auto"
							(click)="this.accountControl.setValue('')"
						/>
						<mat-autocomplete
							#auto="matAutocomplete"
							[displayWith]="displayFn(accounts.value() ?? [])"
						>
							@let items = (filteredOptions | async) ?? [];
							@for (option of items; track option.id) {
								<mat-option [value]="option.id">{{ option.name }}</mat-option>
							}
						</mat-autocomplete>
					</mat-form-field>
					<button mat-button (click)="accountControl.reset()">Clear</button>
				</div>
				@if (selectedAccount() && error === '') {
					@let balance = selectedAccount()?.credit_balance ?? 0;
					@if (diff() > 0) {
						<div class="error" [style.color]="'green'">
							{{ balance | currency }} - {{ total() | currency }} =
							{{ diff() | currency }}
						</div>
					} @else {
						@if (balance > 0) {
							<div class="error" [style.color]="'red'">
								{{ balance | currency }} - {{ total() | currency }} =
								{{ diff() | currency }}
								<div>{{ 'Restbetrag' }} {{ diff() * -1 | currency }}</div>
<!--								<div>{{ 'checkout.cash-remain' }} {{ diff() * -1 | currency }}</div>-->
							</div>
						} @else {
<!--							<div class="error" [style.color]="'red'">{{ 'checkout.account-empty' }}</div>-->
							<div class="error" [style.color]="'red'">{{ 'Konto leer' }}</div>
						}
					}
				}
			}
			<div class="error" [style.color]="'red'">{{ error }}</div>
		</mat-dialog-content>
		<mat-dialog-actions align="end">
<!--			<button mat-button [mat-dialog-close]="-1" cdkFocusInitial>{{ 'checkout.cancel' }}</button>-->
			<button mat-button [mat-dialog-close]="0" cdkFocusInitial>{{ 'Abbrechen' }}</button>
			@switch (paymentOptionControl.value) {
				@case (PaymentOption.CASH) {
					<button mat-button cdkFocusInitial (click)="checkout()">
<!--						{{ 'checkout.cash.title' }}-->
						{{ 'Barzahlung' }}
					</button>
				}
				@case (PaymentOption.ACCOUNT) {
					@let balance = selectedAccount()?.credit_balance ?? 0;
					<button
						mat-button
						[disabled]="!accountControl.value || balance === 0"
						(click)="checkout(PaymentOption.ACCOUNT, selectedAccount()?.id)"
					>
<!--						{{ 'checkout.account.title' }}-->
						{{ 'Kontozahlung' }}
					</button>
				}
			}
			´
		</mat-dialog-actions>
	`,
	styles: `
		.container {
			display: grid;
			gap: 0.5rem;
			grid-template:
				'total' 1fr
				'payment' 1fr
				'account' auto
				'error' auto/1fr;
		}

		.total {
			justify-self: center;
			align-self: center;
			grid-area: total;
		}

		.account {
			justify-self: center;
			grid-area: account;
		}

		.payment {
			justify-self: center;
			grid-area: payment;
		}

		.error {
			justify-self: center;
			grid-area: error;
		}

		.total-container {
			display: flex;
			gap: 0.5em;
			flex-direction: row-reverse;
		}

		.item-1 {
			font-size: 1.5em;
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
	`,
})
export class CartCheckoutDialogComponent implements OnInit {
	cart = inject(OrderStoreService);
	accountService = inject(AccountService);
	checkoutService = inject(CheckoutService);

	public accounts = rxResource({
		loader: () => this.accountService.read(),
	});

	items = toSignal(this.cart.items$);
	total = toSignal(this.cart.subtotal$);
	totalQty = toSignal(this.cart.totalQty$);

	dialogRef: MatDialogRef<CartCheckoutDialogComponent, number> = inject(MatDialogRef);

	accountControl = new FormControl('');
	paymentOptionControl = new FormControl(PaymentOption.CASH, [Validators.required]);

	changed = toSignal(this.accountControl.valueChanges);

	selectedAccount = computed(() => {
		return this.accounts.value()?.find((a) => a.id === (this.changed() ?? ''));
	});

	diff = computed(() => {
		return (this.selectedAccount()?.credit_balance ?? 0) - (this.total() ?? 0);
	});

	error = '';

	filteredOptions: Observable<AutoCompleteOption[]> | undefined;

	ngOnInit(): void {
		this.filteredOptions = this.accountControl.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value ?? '')),
		);
	}

	PaymentOption = PaymentOption;
	PaymentOptionKeys = PaymentOptionKeys;

	private _filter(value: string): AutoCompleteOption[] {
		const filterValue = value.toLowerCase();

		return (
			this.accounts
				.value()
				?.filter((option) => option.lastname.toLowerCase().includes(filterValue))
				.map(
					(o) => ({ id: o.id, name: `${o.lastname} ${o.firstname}`, credit: o.credit_balance }) as AutoCompleteOption,
				) ?? []
		);
	}

	displayFn(options: Account[]): (id: string) => string {
		return (id: string) => {
			const correspondingOption = Array.isArray(options)
				? options.find((option) => option.id === id)
				: null;
			return correspondingOption ? correspondingOption.lastname : '';
		};
	}

	checkout(option = PaymentOption.CASH, account_id?: string) {
		this.error = '';

		const checkoutData = {
			payment_option: option,
			account_id,
			items:
				this.items()
					?.filter((i: CartItem) => i.id !== 'deposit')
					.map((i: CartItem) => ({ id: i.id, qty: i.quantity }) as CheckoutRequestItem) ?? [],
			deposits:
				this.items()
					?.filter((i: CartItem) => i.id === 'deposit')
					.map((i: CartItem) => ({ qty: i.quantity, price: i.price }) as CheckoutRequestItem) ?? [],
		} as CheckoutRequest;

		// console.log(JSON.stringify(checkoutData));

		this.checkoutService.checkout(checkoutData).subscribe({
			next: () => {
				// console.log(JSON.stringify(res));
				this.dialogRef.close(1);
			},
			error: (err) => {
        console.log(err);
        this.dialogRef.close(-1);
			},
		});
	}
}
