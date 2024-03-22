import { Component, OnInit, inject } from '@angular/core';

import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';
import {
  StatisticService,
  Statistics,
} from '../../shared/services/statistic.service';
import { PaymentOption, AccountType } from '../../shared/util/transaction';

@Component({
  selector: 'orda-stat-daily',
  standalone: true,
  template: `<h1>Statistik</h1>
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
    @if (stats !== undefined) {
      <h2>Gesamteinnahmen/Tag</h2>
      {{ stats.total | ordaCurrency }}

      <h2>Bezahloption</h2>
      <h3>Bar/Tag</h3>
      {{ stats.payment_option[PaymentOption.CASH] | ordaCurrency }}
      <h3>Karte/Tag</h3>
      {{ stats.payment_option[PaymentOption.CARD] | ordaCurrency }}
      <h2>Kontotyp</h2>
      <h3>Sponsorausgaben/Tag</h3>
      {{ stats.account_type[AccountType.PREMIUM] | ordaCurrency }}
      <h3>Frei/Tag</h3>
      {{ stats.account_type[AccountType.FREE] | ordaCurrency }}
      <h2>Becherstatistik/Tag</h2>
      Pfand Eingang: {{ stats.deposit.deposit_in }} <br />
      Pfand Ausgang:
      {{ stats.deposit.deposit_out * -1 }}

      <h2>Gesamtübersicht Menge/Produkt</h2>
      TODO
    } `,
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
  ],
})
export class StatisticDailyComponent implements OnInit {
  statisticsService = inject(StatisticService);

  dateControl = new FormControl(new Date());

  PaymentOption = PaymentOption;
  AccountType = AccountType;
  stats?: Statistics;

  public ngOnInit() {
    // this.statisticsService.getStatistics$().subscribe((x) => (this.stats = x));
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`${type}: ${event.value}`);
    this.statisticsService
      .getStatisticsforDate$(event.value?.toString() ?? new Date().toString())
      .subscribe((x) => console.log(x));
  }
}
