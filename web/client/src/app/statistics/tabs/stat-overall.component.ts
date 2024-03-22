import { Component, OnInit, inject, signal } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';
import {
  ArticleStatistics,
  StatisticService,
  Statistics,
} from '../../shared/services/statistic.service';
import { PaymentOption, AccountType } from '../../shared/util/transaction';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'orda-stat-overall',
  standalone: true,
  template: `
    <h2>Gesamteinnahmen/Tag</h2>
    {{ stats().total | ordaCurrency }}

    <h2>Bezahloption</h2>
    <h3>Bar/Tag</h3>
    {{ stats().payment_option[PaymentOption.CASH] | ordaCurrency }}
    <h3>Karte/Tag</h3>
    {{ stats().payment_option[PaymentOption.CARD] | ordaCurrency }}
    <h2>Kontotyp</h2>
    <h3>Sponsorausgaben/Tag</h3>
    {{ stats().account_type[AccountType.PREMIUM] | ordaCurrency }}
    <h3>Frei/Tag</h3>
    {{ stats().account_type[AccountType.FREE] | ordaCurrency }}
    <h2>Becherstatistik/Tag</h2>
    Pfand Eingang: {{ stats().deposit.deposit_in }} <br />
    Pfand Ausgang:
    {{ stats().deposit.deposit_out * -1 }}

    <h2>Gesamtübersicht Menge/Produkt</h2>

    <section class="example-container mat-elevation-z8" tabindex="0">
      <table mat-table [dataSource]="articleStats()">
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
  articleStats = signal<ArticleStatistics>([]);

  public ngOnInit() {
    this.statisticsService.getStatistics$().subscribe((x) => this.stats.set(x));
    this.statisticsService
      .getArticleStatistics$()
      .subscribe((x) => this.articleStats.set(x));
  }
}
