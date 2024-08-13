import { Component, OnInit, inject, input, signal } from '@angular/core';

import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';
import {
  ProductStatistics,
  StatisticService,
  Statistics,
} from '../../shared/services/statistic.service';
import { PaymentOption, AccountType } from '../../shared/util/transaction';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { StatCardComponent } from '../stat-card.component';

@Component({
  selector: 'orda-stat-daily',
  standalone: true,
  template: `
    <h2>{{ 'statistic.income' | transloco }}</h2>
    <mat-form-field>
      <mat-label>{{ 'statistic.choose_date' | transloco }}</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        (dateInput)="addEvent('input', $event)"
        (dateChange)="addEvent('change', $event)"
        [formControl]="dateControl"
      />
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
    <div class="dashboard">
      <orda-stat-card
        [title]="'statistic.total_per_day' | transloco"
        [value]="stats().total | ordaCurrency"
      />

      <orda-stat-card
        [title]="'statistic.cash_per_day' | transloco"
        [value]="stats().payment_option[PaymentOption.CASH] | ordaCurrency"
      />
      <orda-stat-card
        [title]="'statistic.card_per_day' | transloco"
        [value]="stats().payment_option[PaymentOption.CARD] | ordaCurrency"
      />

      <orda-stat-card
        [title]="'statistic.premium_per_day' | transloco"
        [value]="stats().account_type[AccountType.PREMIUM] | ordaCurrency"
      />
      <orda-stat-card
        [title]="'statistic.free_per_day' | transloco"
        [value]="stats().account_type[AccountType.FREE] | ordaCurrency"
      />

      <orda-stat-card
        [title]="'statistic.deposit_in_per_day' | transloco"
        [value]="stats().deposit.deposit_in"
      />
      <orda-stat-card
        [title]="'statistic.deposit_out_per_day' | transloco"
        [value]="stats().deposit.deposit_out * -1"
      />
    </div>

    <h2>{{ 'statistic.products_sold_per_day' | transloco }}</h2>
    <section class="example-container mat-elevation-z8" tabindex="0">
      <table mat-table [dataSource]="productStats()">
        <!-- Desc Column -->
        <ng-container matColumnDef="desc">
          <th mat-header-cell *matHeaderCellDef>
            {{ 'table.desc' | transloco }}
          </th>
          <td mat-cell *matCellDef="let element">
            {{ element.description }}
          </td>
        </ng-container>

        <!-- Qty Column -->
        <ng-container matColumnDef="qty">
          <th mat-header-cell *matHeaderCellDef>
            {{ 'table.qty' | transloco }}
          </th>
          <td mat-cell *matCellDef="let element">{{ element.qty }}</td>
        </ng-container>

        <tr
          mat-header-row
          *matHeaderRowDef="displayedColumns; sticky: true"
        ></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }

      .dashboard {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
    `,
  ],
  providers: [provideNativeDateAdapter()],
  imports: [
    OrdaCurrencyPipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TranslocoModule,
    ReactiveFormsModule,
    DatePipe,
    MatTableModule,
    StatCardComponent,
  ],
})
export class StatisticDailyComponent implements OnInit {
  statisticsService = inject(StatisticService);

  dateControl = new FormControl(new Date());

  PaymentOption = PaymentOption;
  AccountType = AccountType;

  displayedColumns = ['desc', 'qty'];

  stats = signal<Statistics>({
    account_type: [],
    deposit: { deposit_in: 0, deposit_out: 0 },
    payment_option: [],
    total: 0,
  });
  productStats = signal<ProductStatistics>([]);

  public ngOnInit() {
    const date = new Date().toISOString();
    this.statisticsService
      .getStatisticsforDate$(date)
      .subscribe((x) => this.stats.set(x));
    this.statisticsService
      .getProductStatisticsforDate$(date)
      .subscribe((x) => this.productStats.set(x));
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type === 'change' && event.value) {
      const date = event.value?.toISOString();
      this.statisticsService
        .getStatisticsforDate$(date)
        .subscribe((x) => this.stats.set(x));
      this.statisticsService
        .getProductStatisticsforDate$(date)
        .subscribe((x) => this.productStats.set(x));
    }
  }
}
