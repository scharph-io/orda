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
    <div class="flex flex-col gap-6 p-6 min-w-[350px] sm:min-w-[450px]">
      <div class="flex flex-col items-center justify-center space-y-1">
        <span class="text-xl text-gray-500 font-medium">{{ 'Summe' }}:</span>
        <span class="text-6xl font-black text-gray-900 tracking-tight">
          {{ total() ?? 0 | currency: 'EUR' }}
        </span>
      </div>

      <div class="flex justify-center">
        <mat-button-toggle-group
          [formControl]="paymentOptionControl"
          aria-label="Payment option"
          class="scale-110 shadow-sm"
        >
          <mat-button-toggle [value]="PaymentOption.CASH">
            {{ PaymentOptionKeys[PaymentOption.CASH] }}
          </mat-button-toggle>

          @if ((total() ?? 0) > 0) {
            <mat-button-toggle [value]="PaymentOption.FREE">
              {{ PaymentOptionKeys[PaymentOption.FREE] }}
            </mat-button-toggle>
            <mat-button-toggle [value]="PaymentOption.SPONSOR">
              {{ PaymentOptionKeys[PaymentOption.SPONSOR] }}
            </mat-button-toggle>
            <mat-button-toggle [value]="PaymentOption.ACCOUNT">
              {{ PaymentOptionKeys[PaymentOption.ACCOUNT] }}
            </mat-button-toggle>
          }
        </mat-button-toggle-group>
      </div>

      @if (paymentOptionControl.value === PaymentOption.ACCOUNT) {
        <div class="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
            <mat-label>{{ 'Konto wählen' }}</mat-label>
            <mat-select [formControl]="accountControl">
              @for (group of accountMap() | keyvalue; track group.key) {
                <mat-optgroup [label]="group.key">
                  @for (acc of group.value; track acc) {
                    <mat-option [value]="acc.id" [disabled]="acc.credit_balance <= 0">
                      {{ acc.lastname }} {{ acc.firstname }}
                      <span class="ml-2 text-gray-400 text-sm"
                        >({{ acc.credit_balance | currency }})</span
                      >
                    </mat-option>
                  }
                </mat-optgroup>
              }
            </mat-select>
          </mat-form-field>

          @if (selectedAccount() && error === '') {
            @let balance = selectedAccount()?.credit_balance ?? 0;
            @let totalSum = total() ?? 0;
            @let difference = diff();

            <div class="text-center text-lg bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span class="font-mono text-gray-600">{{ balance | currency }}</span>
              <span class="mx-2 text-gray-400">-</span>
              <span class="font-mono text-gray-600">{{ totalSum | currency }}</span>
              <span class="mx-2 text-gray-400">=</span>

              @if (difference >= 0) {
                <span class="font-bold text-emerald-600">{{ difference | currency }}</span>
              } @else if (balance > 0) {
                <span class="font-bold text-amber-500">{{ difference | currency }}</span>
              } @else {
                <span class="font-bold text-rose-600">{{ 'Leer' }}</span>
              }
            </div>

            @if (difference < 0 && balance > 0) {
              <div class="text-center text-amber-500 font-medium">
                Restbetrag von <strong>{{ difference * -1 | currency }}</strong> muss bar bezahlt
                werden.
              </div>
            } @else if (balance <= 0) {
              <div class="text-center text-rose-600 font-bold">
                {{ 'Konto leer' }}
              </div>
            }
          }
        </div>
      }

      @if (error) {
        <div
          class="p-3 bg-red-50 text-red-600 rounded-md text-center font-medium border border-red-100"
        >
          {{ error }}
        </div>
      }
    </div>

    <div class="grid grid-cols-3 gap-4 px-6 pb-6">
      <button
        mat-flat-button
        [mat-dialog-close]="0"
        class="col-span-1 !bg-rose-500 !text-white !h-14 !rounded-xl"
      >
        {{ 'Abbrechen' }}
      </button>

      @switch (paymentOptionControl.value) {
        @case (PaymentOption.CASH) {
          <button
            mat-flat-button
            class="col-span-2 !bg-emerald-600 !text-white !h-14 !text-lg !rounded-xl"
            (click)="checkout(data.view_id)"
          >
            {{ 'Bar' }}
          </button>
        }
        @case (PaymentOption.ACCOUNT) {
          @let balance = selectedAccount()?.credit_balance ?? 0;
          @let difference = diff();
          <button
            mat-flat-button
            class="col-span-2 !h-14 !text-lg !rounded-xl transition-colors"
            [class]="badgeClass()"
            [disabled]="!accountControl.value || balance === 0"
            (click)="checkout(data.view_id, PaymentOption.ACCOUNT, selectedAccount()?.id)"
          >
            @if (difference < 0 && balance > 0) {
              <span>{{ difference * -1 | currency }} Bar</span>
            } @else {
              <span>Konto</span>
            }
          </button>
        }
        @case (PaymentOption.FREE) {
          <button
            mat-flat-button
            class="col-span-2 !bg-blue-500 !text-white !h-14 !text-lg !rounded-xl"
            (click)="checkout(data.view_id, PaymentOption.FREE)"
          >
            {{ 'Frei' }}
          </button>
        }
        @case (PaymentOption.SPONSOR) {
          <button
            mat-flat-button
            class="col-span-2 !bg-purple-500 !text-white !h-14 !text-lg !rounded-xl"
            (click)="checkout(data.view_id, PaymentOption.SPONSOR)"
          >
            {{ 'Sponsor' }}
          </button>
        }
      }
    </div>
  `,
  styles: [
    `
      /* Ensure the dialog has no default padding so our Tailwind classes control it */
      :host {
        display: block;
      }
      ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
        border-radius: 1rem !important; /* Rounded corners for the modal itself */
      }
    `,
  ],
})
export class CartCheckoutDialogComponent {
  cart = inject(OrderStoreService);
  accountService = inject(AccountService);
  checkoutService = inject(CheckoutService);

  public accounts = rxResource({
    stream: () => this.accountService.read(),
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
        this.error = 'Checkout fehlgeschlagen';
      },
    });
  }

  groupAndSortByLastnameInitial(persons: Account[]): Record<string, Account[]> {
    const groups = persons.reduce<Record<string, Account[]>>((acc, p) => {
      const initial = p.lastname.charAt(0).toUpperCase();
      (acc[initial] ||= []).push(p);
      return acc;
    }, {});

    for (const initial in groups) {
      groups[initial].sort((a, b) => {
        const lnCmp = a.lastname.localeCompare(b.lastname);
        return lnCmp !== 0 ? lnCmp : a.firstname.localeCompare(b.firstname);
      });
    }

    const sortedResult: Record<string, Account[]> = {};
    for (const key of Object.keys(groups).sort()) {
      sortedResult[key] = groups[key];
    }

    return sortedResult;
  }

  badgeClass = computed(() => {
    const balance = this.selectedAccount()?.credit_balance ?? 0;
    if (!this.accountControl.value || balance === 0) {
      return '!bg-gray-300 text-gray-500';
    }
    if (balance > 0 && this.diff() < 0) {
      return '!bg-amber-500 !text-white';
    }
    return '!bg-emerald-600 !text-white';
  });
}
