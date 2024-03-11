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
import { CheckoutData, CheckoutService } from '../../services/checkout.service';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';
import {
  MessageService,
  Severity,
} from '../../../shared/services/message.service';
import { TranslocoModule } from '@ngneat/transloco';
import {
  AccountType,
  PaymentOption,
  AccountTypeKeys,
  PaymentOptionKeys,
} from '../../../shared/util/transaction';

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
    TranslocoModule,
  ],
  providers: [OrdaCurrencyPipe],
  template: `
    <div mat-dialog-content class="container">
      <div class="total">
        <div class="total-container">
          <div class="item-0">
            {{ checkoutData.total | ordaCurrency: 'EUR' }}
          </div>
          <div class="item-1">Total:</div>
        </div>
      </div>
      @if (checkoutData.total > 0) {
        <div class="account">
          <mat-button-toggle-group
            [formControl]="accountControl"
            aria-label="Account type"
          >
            <mat-button-toggle [value]="AccountType.CUSTOMER">{{
              AccountTypeKeys[AccountType.CUSTOMER] | transloco
            }}</mat-button-toggle>
            <mat-button-toggle [value]="AccountType.FREE">{{
              AccountTypeKeys[AccountType.FREE] | transloco
            }}</mat-button-toggle>
            <mat-button-toggle [value]="AccountType.PREMIUM">{{
              AccountTypeKeys[AccountType.PREMIUM] | transloco
            }}</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
        <div class="payment">
          @if (accountControl.value === AccountType.CUSTOMER) {
            <mat-button-toggle-group
              [formControl]="paymentOptionControl"
              aria-label="Payment option"
            >
              <mat-button-toggle [value]="PaymentOption.CASH">{{
                PaymentOptionKeys[PaymentOption.CASH] | transloco
              }}</mat-button-toggle>
              <mat-button-toggle [value]="PaymentOption.CARD">{{
                PaymentOptionKeys[PaymentOption.CARD] | transloco
              }}</mat-button-toggle>
            </mat-button-toggle-group>
          }
        </div>
      }
      <div class="error" [style.color]="'red'">{{ error }}</div>
    </div>

    <div mat-dialog-actions [style.justify-content]="'space-evenly'">
      <button mat-button [mat-dialog-close]="{ clear: false }">Cancel</button>
      @if (checkoutData.total > 0) {
        <button
          class="btn-checkout"
          mat-button
          color="warn"
          cdkFocusInitial
          (click)="
            submit(
              asAccountType(accountControl.value ?? 0),
              asPaymentOption(paymentOptionControl.value ?? 0)
            )
          "
        >
          <mat-icon>shopping_cart_checkout</mat-icon>
          {{
            AccountTypeKeys[asAccountType(accountControl.value ?? 0)]
              | transloco
          }}
          @if (accountControl.value === AccountType.CUSTOMER) {
            {{
              PaymentOptionKeys[
                asPaymentOption(paymentOptionControl.value ?? 0)
              ] | transloco
            }}
          }
        </button>
      } @else if (checkoutData.total === 0) {
        <button
          class="btn-checkout"
          mat-button
          color="warn"
          cdkFocusInitial
          (click)="submit(AccountType.CUSTOMER, PaymentOption.CASH)"
        >
          <mat-icon>shopping_cart_checkout</mat-icon>
          {{ 'checkout.settle' | transloco }}
        </button>
      } @else {
        <button
          class="btn-checkout"
          mat-button
          color="warn"
          cdkFocusInitial
          (click)="submit(AccountType.CUSTOMER, PaymentOption.CASH)"
        >
          <mat-icon>shopping_cart_checkout</mat-icon>
          {{ 'checkout.payout' | transloco }}
          {{ PaymentOptionKeys[PaymentOption.CASH] | transloco }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      .container {
        display: grid;
        gap: 1em;
        grid-template:
          'total' 1fr
          'account' auto
          'payment' 0.7fr
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
        flex-basis: 1;
        align-self: center;
      }

      mat-toggle-button {
        background-color: #e0e0e0;
      }

      .mat-button-toggle-appearance-standard.mat-button-toggle-checked {
        color: #e0e0e0;
        background-color: #682bff;
      }

      .btn-checkout {
        background-color: #f29f05b0;
        color: #606b73;
      }
    `,
  ],
})
export class CheckoutDialogComponent {
  accountControl = new FormControl(AccountType.CUSTOMER, [Validators.required]);
  paymentOptionControl = new FormControl(PaymentOption.CASH, [
    Validators.required,
  ]);

  error = '';

  checkoutData: CheckoutData = {
    items: [],
    total: 0,
    account_type: AccountType.CUSTOMER,
    payment_option: PaymentOption.FREE,
  };

  AccountType = AccountType;
  AccountTypeKeys = AccountTypeKeys;

  PaymentOption = PaymentOption;
  PaymentOptionKeys = PaymentOptionKeys;

  checkout = inject(CheckoutService);
  message = inject(MessageService);

  constructor(
    private currencyPipe: OrdaCurrencyPipe,
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
    this.checkoutData.account_type = accountType;
    this.checkoutData.payment_option = paymentOption;

    this.checkout.checkout(this.checkoutData).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.error = '';
          this.dialogRef.close({ clear: true });
          this.message.send({
            title: `${this.currencyPipe.transform(this.checkoutData.total)} in ${AccountTypeKeys[accountType]} using ${PaymentOptionKeys[paymentOption]}.`,
            severity: Severity.INFO,
          });
        }
      },
      error: (err) => {
        this.error = err.message;
        this.message.send({
          title: `${err.message}`,
          severity: Severity.ERROR,
        });
      },
    });
  }

  asAccountType(value: number): AccountType {
    return value as AccountType;
  }

  asPaymentOption(value: number): PaymentOption {
    return value as PaymentOption;
  }
}
