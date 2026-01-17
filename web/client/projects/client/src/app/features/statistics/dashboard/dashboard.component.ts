import { Component, computed, inject, input } from '@angular/core';
import {
  PaymentOptionsMap,
  StatisticsService,
} from '@orda.features/data-access/services/statistics.service';
import { MetricCardComponent } from '@orda.shared/components/metric-card/metric-card.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { PaymentOption, PaymentOptionKeys } from '@orda.features/order/utils/transaction';
import { keyToNumber } from '@orda.shared/utils/helper';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'orda-dashboard',
  imports: [MetricCardComponent, DecimalPipe, MatIcon],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  statisticsService = inject(StatisticsService);

  msg = input<string>();
  from = input.required<Date | undefined>();
  to = input.required<Date | undefined>();

  protected PaymentOptionsKeys = PaymentOptionKeys;
  protected PaymentOptionsArr = Object.values(PaymentOption).filter(
    (v) => typeof v === 'number',
  ) as number[];

  protected params = computed(() => {
    return {
      from: this.from(),
      to: this.to(),
    };
  });

  protected paymentStat = rxResource({
    params: this.params,
    stream: ({ params }) => this.statisticsService.getPaymentOptions(params.from, params.to),
    defaultValue: {
      from: new Date(new Date()),
      to: new Date(new Date()),
      data: {},
    },
  });

  protected data = computed(() => this.paymentStat.value().data);

  protected keyToNumber = keyToNumber;

  protected hasDataKeys = (d: PaymentOptionsMap | null) =>
    d !== null ? Object.keys(d).length > 0 : false;
}
