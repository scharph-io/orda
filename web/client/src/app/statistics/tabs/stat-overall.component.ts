import { Component, OnInit, inject, signal } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';
import {
  ProductStatistics,
  StatisticService,
  Statistics,
} from '../../shared/services/statistic.service';
import { PaymentOption, AccountType } from '../../shared/util/transaction';
import { MatTableModule } from '@angular/material/table';
import { StatCardComponent } from '../stat-card.component';

@Component({
  selector: 'orda-stat-overall',
  standalone: true,
  template: `
    <h2>{{'statistic.income' | transloco}}</h2>
    <div class="dashboard">
    <orda-stat-card [title]="'statistic.total' | transloco" [value]="stats().total | ordaCurrency" />

    <orda-stat-card [title]="'statistic.cash' | transloco" [value]="stats().payment_option[PaymentOption.CASH] | ordaCurrency" />
    <orda-stat-card [title]="'statistic.card' | transloco" [value]="stats().payment_option[PaymentOption.CARD] | ordaCurrency" />

    <orda-stat-card [title]="'statistic.premium' | transloco" [value]="stats().account_type[AccountType.PREMIUM] | ordaCurrency" />
    <orda-stat-card [title]="'statistic.free' | transloco" [value]="stats().account_type[AccountType.FREE] | ordaCurrency" />

    <orda-stat-card [title]="'statistic.deposit_in' | transloco" [value]="stats().deposit.deposit_in" />
    <orda-stat-card [title]="'statistic.deposit_out' | transloco" [value]="stats().deposit.deposit_out * -1" />
  </div>

    <h2>{{'statistic.products_sold' | transloco}}</h2>

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
    MatTableModule,
    StatCardComponent
  ],
})
export class StatisticOverallComponent implements OnInit {
  statisticsService = inject(StatisticService);

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
    this.statisticsService.getStatistics$().subscribe((x) => this.stats.set(x));
    this.statisticsService
      .getProductStatistics$()
      .subscribe((x) => this.productStats.set(x));
  }
}
