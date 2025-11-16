import { Component, computed, inject, input } from '@angular/core';
import {
	PaymentOptionsMap,
	StatisticsService,
} from '@orda.features/data-access/services/statistics.service';
import { MetricCardComponent } from '@orda.shared/components/metric-card/metric-card.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { PaymentOption, PaymentOptionKeys } from '@orda.features/order/utils/transaction';
import { hasKey, keyToNumber } from '@orda.shared/utils/helper';
import { EMPTY } from 'rxjs';

@Component({
	selector: 'orda-dashboard',
	imports: [MetricCardComponent, DecimalPipe, JsonPipe],
	template: `
		@let d = data.value()!;
		@for (o of PaymentOptionsArr; track o) {
<!--			{{ hasKey(d.data, o) }}-->
<!--			{{ hasDataValue(d.data) }}-->
			@if (hasDataValue(d.data)) {

<!--				@let amount = d.data[o].total_amount;-->
<!--				<orda-metric-card-->
<!--					[loading]="!data.hasValue()"-->
<!--					[value]="amount | number: '1.2-2'"-->
<!--					[label]="PaymentOptionsKeys[keyToNumber(o)]"-->
<!--					[unit]="'€'"-->
<!--				/>-->
			} @else {
				<orda-metric-card
					[loading]="!data.hasValue()"
					[label]="PaymentOptionsKeys[keyToNumber(o)]"
					[unit]="'€'"
				/>
			}
		}
	`,
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
	statisticsService = inject(StatisticsService);

	msg = input<string>();
	from = input.required<Date>();
	to = input.required<Date>();

	protected PaymentOptionsKeys = PaymentOptionKeys;
	protected PaymentOptionsArr = Object.values(PaymentOption).filter(
		(v) => typeof v === 'number',
	) as number[];

	protected params = computed(() => ({
		from: this.from(),
		to: this.to(),
	}));

	protected data = rxResource({
		params: this.params,
		stream: ({ params }) => {
			if (params.from.toDateString() === params.to.toDateString()) {
				return EMPTY;
			}
			return this.statisticsService.getPaymentOptions(params.from, params.to);
		},
	});

	protected keyToNumber = keyToNumber;
	protected hasKey = hasKey;

	protected hasDataValue = (d?: PaymentOptionsMap) => {
		if(d) {
			return Object.values(d).length > 0
		}
		return false;
	};
}
