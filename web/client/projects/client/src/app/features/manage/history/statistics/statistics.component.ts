import { Component, inject, input } from '@angular/core';
import { TransactionService } from '@orda.features/data-access/services/transaction.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { PaymentOptionKeys } from '@orda.features/order/utils/transaction';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { keyToNumber } from '@orda.shared/utils/helper';

@Component({
  selector: 'orda-statistics',
  imports: [DatePipe, KeyValuePipe, OrdaCurrencyPipe],
  template: `
    @let stats = summary.value();
    @if (stats) {
      {{ stats.period.from | date: 'short' }} - {{ stats.period.to | date: 'short' }}

      @if (stats.summary.payments && stats.summary.payments[0]) {
        <h3>Zahlungsübersicht</h3>
        @let payments = stats.summary.payments;
        @for (x of payments | keyvalue; track x.key) {
          <p>{{ PaymentOptionKeys[keyToNumber(x.key)] }}: {{ x.value | currency }}</p>
        }
      }
      @if (stats.summary.products && stats.summary.products.length > 0) {
        <h3>Produktstatistik</h3>
        @let products = stats.summary.products;
        @for (x of products; track $index) {
          {{ x.name }} {{ x.desc }}: {{ x.total_quantity }} <br />
        }
      }

      @if (stats.summary.views && stats.summary.views.length > 0) {
        <h3>Ansichten</h3>
        @let views = stats.summary.views;

        @for (x of views; track $index) {
          {{ x.name }}: Umsatz bar {{ x.sum_total | currency }} | Guthaben verbraucht:
          {{ x.sum_total_credit | currency }}
          <br />
        }
      }
    }
  `,
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  transactionService = inject(TransactionService);

  readonly date = input.required<string>();

  summary = rxResource({
    params: () => this.date(),
    stream: ({ params }) => this.transactionService.getSummaryByDate(params ?? undefined),
  });
  protected readonly PaymentOptionKeys = PaymentOptionKeys;

  protected keyToNumber = keyToNumber;
}
