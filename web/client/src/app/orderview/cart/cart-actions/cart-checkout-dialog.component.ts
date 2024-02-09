import { Component, Inject, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { CartItem } from '../cart.store';
import {
  MatButtonToggle,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import {
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  CheckoutData,
  CheckoutService,
  AccountTypeKeys,
  PaymentOptionKeys,
  AccountType,
  PaymentOption,
} from '../../services/checkout.service';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';

@Component({
  selector: 'orda-checkout-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    OrdaCurrencyPipe,
    FormsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatButtonToggle,
    ReactiveFormsModule,
  ],
  template: `
    <h1 mat-dialog-title>Summary</h1>
    <div mat-dialog-content>
      Total: {{ checkoutData.total | ordaCurrency: 'EUR' }}
      <mat-button-toggle-group
        [formControl]="accountControl"
        aria-label="Account type"
      >
        <mat-button-toggle
          [style.color]="'red'"
          [value]="AccountType.CUSTOMER"
          >{{ AccountTypeKeys[AccountType.CUSTOMER] }}</mat-button-toggle
        >
        <mat-button-toggle [value]="AccountType.FREE">{{
          AccountTypeKeys[AccountType.FREE]
        }}</mat-button-toggle>
        <mat-button-toggle [value]="AccountType.ADVANCED">{{
          AccountTypeKeys[AccountType.ADVANCED]
        }}</mat-button-toggle>
      </mat-button-toggle-group>

      @if (accountControl.value === AccountType.CUSTOMER) {
        <mat-button-toggle-group
          [formControl]="paymentOptionControl"
          aria-label="Payment option"
        >
          <mat-button-toggle
            [style.color]="'red'"
            [value]="PaymentOption.CASH"
            >{{ PaymentOptionKeys[PaymentOption.CASH] }}</mat-button-toggle
          >
          <mat-button-toggle [value]="PaymentOption.CARD">{{
            PaymentOptionKeys[PaymentOption.CARD]
          }}</mat-button-toggle>
        </mat-button-toggle-group>
      }
    </div>

    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="{ clear: false }">Cancel</button>
      <button
        mat-button
        color="warn"
        [mat-dialog-close]="{
          clear: true,
          accountType: accountControl.value,
          paymentOption: paymentOptionControl.value
        }"
        cdkFocusInitial
        (click)="
          submit(
            asAccountType(accountControl.value ?? 0),
            asPaymentOption(paymentOptionControl.value ?? 0)
          )
        "
      >
        <mat-icon>shopping_cart_checkout</mat-icon>
        {{ AccountTypeKeys[asAccountType(accountControl.value ?? 0)] }}
        @if (accountControl.value === AccountType.CUSTOMER) {
          {{
            PaymentOptionKeys[asPaymentOption(paymentOptionControl.value ?? 0)]
          }}
        }
      </button>
    </div>
  `,
})
export class CheckoutDialogComponent {
  accountControl = new FormControl(0, [Validators.required]);
  paymentOptionControl = new FormControl(0, [Validators.required]);

  checkoutData: CheckoutData = {
    items: [],
    total: 0,
    accountType: AccountType.CUSTOMER,
    paymentOption: PaymentOption.FREE,
  };

  AccountType = AccountType;
  AccountTypeKeys = AccountTypeKeys;

  PaymentOption = PaymentOption;
  PaymentOptionKeys = PaymentOptionKeys;

  checkout = inject(CheckoutService);

  constructor(
    public dialogRef: MatDialogRef<CheckoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CartItem[],
  ) {
    this.checkoutData.items = this.data;
    this.checkoutData.total = this.data.reduce(
      (a, b) => a + b.price * b.quantity,
      0,
    );
  }

  submit(accountType: AccountType, paymentOption: PaymentOption): void {
    this.checkoutData.accountType = accountType;
    this.checkoutData.paymentOption = paymentOption;
    this.checkout.checkout(this.checkoutData).subscribe((res) => {
      console.log(res);
    });
  }

  asAccountType(value: number): AccountType {
    return value as AccountType;
  }

  asPaymentOption(value: number): PaymentOption {
    return value as PaymentOption;
  }
}
