import { Component, OnInit, inject } from '@angular/core';
import {
  StatisticService,
  Statistics,
} from '../shared/services/statistic.service';
import { OrdaCurrencyPipe } from '../shared/currency.pipe';
import { AccountType, PaymentOption } from '../shared/util/transaction';

@Component({
  selector: 'orda-statistic',
  standalone: true,
  template: `<h1>Statistik</h1>
    @if (stats !== undefined) {
      <h2>Gesamteinnahmen/Tag</h2>
      {{ stats.total | ordaCurrency }}

      <h2>Bareinnahmen/Tag</h2>
      {{ stats.payment_option[PaymentOption.CASH] | ordaCurrency }}
      <h2>Sponsorausgaben/Tag</h2>
      {{ stats.account_type[AccountType.PREMIUM] | ordaCurrency }}
      <h2>Frei/Tag</h2>
      {{ stats.payment_option[AccountType.FREE] | ordaCurrency }}
      <h2>Becherstatistik/Tag</h2>
      Pfand Eingang: {{ stats.deposit.deposit_in }} <br />
      Pfand Ausgang:
      {{ stats.deposit.deposit_out * -1 }}
      <h2>Bezahlt mit Karte</h2>
      {{ stats.payment_option[PaymentOption.CARD] | ordaCurrency }}

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
  imports: [OrdaCurrencyPipe],
})
export class StatisticComponent implements OnInit {
  statisticsService = inject(StatisticService);

  PaymentOption = PaymentOption;
  AccountType = AccountType;
  stats?: Statistics;

  public ngOnInit() {
    this.statisticsService.getStatistics$().subscribe((x) => (this.stats = x));
  }
}
