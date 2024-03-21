import { Component, OnInit, inject } from '@angular/core';
import {
  StatisticService,
  Statistics,
} from '../shared/services/statistic.service';
import { JsonPipe } from '@angular/common';
import { OrdaCurrencyPipe } from '../shared/currency.pipe';

@Component({
  selector: 'orda-statistic',
  standalone: true,
  template: `<h1>Statistik</h1>

    <!-- {{ statisitics | json }} -->

    @if (statisitics !== undefined) {
      <h2>Gesamteinnahmen/Tag {{ statisitics.total }}</h2>

      <!-- <h2>Bareinnahmen/Tag</h2>
      <h2>Sponsorausgaben/Tag</h2>
      {{ stat.total | ordaCurrency }}
      <h2>Frei/Tag</h2>
      {{ stat.total | ordaCurrency }}
      <h2>Becherstatistik/Tag</h2>
      <h2>Gesamtübersicht Menge/Produkt</h2>
      -->
    } `,
  styles: [],
  imports: [OrdaCurrencyPipe, JsonPipe],
})
export class StatisticComponent implements OnInit {
  statistics = inject(StatisticService);

  statisitics?: Statistics;

  public ngOnInit() {
    this.statistics.getStatistics$().subscribe((x) => (this.statisitics = x));
  }
}
