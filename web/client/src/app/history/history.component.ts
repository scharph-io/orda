import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TransactionService } from '../shared/services/transaction.service';
import { Transaction } from '../shared/model/transaction';
import { DatePipe, JsonPipe } from '@angular/common';
import { OrdaCurrencyPipe } from '../shared/currency.pipe';
import { ItemsTableComponent } from './items-table/items-table.component';
import { PaymentOptionPipe } from '../shared/pipes/payment-option.pipe';
import { AccountTypePipe } from '../shared/pipes/account-type.pipe';
import { TranslocoModule } from '@ngneat/transloco';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'orda-history',
  standalone: true,
  imports: [
    MatExpansionModule,
    JsonPipe,
    OrdaCurrencyPipe,
    ItemsTableComponent,
    DatePipe,
    PaymentOptionPipe,
    AccountTypePipe,
    TranslocoModule,
    MatChipsModule,
  ],
  template: `
    <div class="container">
      <h2>History</h2>
      <!-- <h3>{{ info }}</h3> -->
      @if (transactions?.length === 0) {
        <p>No transactions found</p>
      }
      <mat-accordion>
        @for (transaction of transactions; track transaction) {
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                {{ transaction.transaction_nr }}</mat-panel-title
              >
              <mat-panel-description>
                {{ transaction.total | ordaCurrency }}
              </mat-panel-description>
            </mat-expansion-panel-header>

            <mat-chip-listbox style="margin: 0.5rem;">
              <mat-chip-option>{{
                transaction.CreatedAt | date: 'medium'
              }}</mat-chip-option>

              <mat-chip-option color="primary"
                >{{ 'accountType' | transloco }}:
                {{
                  transaction.account_type | accountType | transloco
                }}</mat-chip-option
              >
              <mat-chip-option color="warn"
                >{{ 'paymentOption' | transloco }}:
                {{
                  transaction.payment_option | paymentOption | transloco
                }}</mat-chip-option
              >
            </mat-chip-listbox>
            <orda-items-table [items]="transaction.items"></orda-items-table>
          </mat-expansion-panel>
        }
      </mat-accordion>
    </div>
  `,
  styles: [
    `
      .container {
        border: 1px solid red;
        margin: 0.5em 1em;
      }
    `,
  ],
})
export class HistoryComponent {
  transactions?: Transaction[];

  transactionService = inject(TransactionService);
  authService = inject(AuthService);

  info = 'Loading...';
  constructor() {
    if (this.authService.isAdmin()) {
      this.transactionService.getTransactions$().subscribe((transactions) => {
        this.info = 'all';
        this.transactions = transactions;
      });
    } else {
      this.transactionService
        .getTransactionsLast2Days$()
        .subscribe((transactions) => {
          this.info = 'last2days';
          this.transactions = transactions;
        });
    }
  }

  isAdmin() {
    return this.authService.isAdmin();
  }
}
