import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { CheckoutRequest } from '@orda.features/order/services/checkout.service';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
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
		<h2 mat-dialog-title>Checkout</h2>
		<mat-dialog-content class="container">
			<div class="total">
				<div class="total-container">
					<div class="item-0">
						{{ total() | currency: 'EUR' }}
					</div>
					<div class="item-1">{{ 'cart.total' }}:</div>
				</div>
			</div>
			@let totalSum = total() ?? 0;
			@if (totalSum > 0) {
				<div class="payment">
					<mat-button-toggle-group [formControl]="paymentOptionControl" aria-label="Payment option">
						<mat-button-toggle [value]="PaymentOption.CASH">{{
							PaymentOptionKeys[PaymentOption.CASH]
						}}</mat-button-toggle>
						<mat-button-toggle [value]="PaymentOption.ACCOUNT">{{
							PaymentOptionKeys[PaymentOption.ACCOUNT]
						}}</mat-button-toggle>
					</mat-button-toggle-group>
				</div>
				@if (paymentOptionControl.value === PaymentOption.ACCOUNT) {
					<div class="account">
						<mat-form-field class="example-full-width">
							<mat-label>{{ 'checkout.account' }}</mat-label>
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
					@if (selectedAccount()) {
						@if (diff() > 0) {
							<div class="error" [style.color]="'green'">
								{{ selectedAccount()?.credit_balance | currency }} - {{ total() | currency }} =
								{{ diff() | currency }}
							</div>
						} @else {
							<div class="error" [style.color]="'red'">
								{{ selectedAccount()?.credit_balance | currency }} - {{ total() | currency }} =
								{{ diff() | currency }}
								<div>{{ 'checkout.cash-remain' }} {{ diff() * -1 | currency }}</div>
							</div>
						}

						@if (diff() < 0) {}
					}
				}
			}
			<div class="error" [style.color]="'red'">{{ error }}</div>
		</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-button [mat-dialog-close]="-1">{{ 'checkout.cancel' }}</button>
			<button
				[disabled]="paymentOptionControl.value === null"
				mat-button
				[mat-dialog-close]="1"
				cdkFocusInitial
			>
				{{ 'checkout.title' }}
			</button>
		</mat-dialog-actions>
	`,
	styles: ``,
})
export class CartCheckoutDialogComponent implements OnInit {
	cart = inject(OrderStoreService);
	accountService = inject(AccountService);

	public accounts = rxResource({
		loader: () => this.accountService.read(),
	});

	items = toSignal(this.cart.items$);
	total = toSignal(this.cart.subtotal$);
	totalQty = toSignal(this.cart.totalQty$);

	dialogRef: MatDialogRef<CartCheckoutDialogComponent, string> = inject(MatDialogRef);

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

	checkoutData: CheckoutRequest = {
		items: [],
		payment_option: PaymentOption.CASH,
	};

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
					(o) => ({ id: o.id, name: o.lastname, credit: o.credit_balance }) as AutoCompleteOption,
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
}
