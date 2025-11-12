import { Component, inject, signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import {
	OrdaDateRange,
	OrdaDayPickerComponent,
} from '@orda.shared/components/date-pickers/day-picker/day-picker.component';
import { MetricCardComponent } from '@orda.shared/components/metric-card/metric-card.component';

@Component({
	selector: 'orda-day',
	imports: [OrdaDayPickerComponent, MetricCardComponent],
	providers: [provideNativeDateAdapter()],
	template: `
		<div class="orda-date-picker">
			<orda-day-picker
				[from]="currentDate()"
				[datesAllowed]="transactionDates.value()"
				(datesChanged)="changed($event)"
			/>
			<!--			{{ from().toLocaleDateString() }}-->
			<!--			{{ to().toLocaleDateString() }}-->
			<div class="dashboard-grid">
				<orda-metric-card label="Success rate" value="98.5" unit="%" />
				<orda-metric-card label="Success rate" value="98.5" unit="%" />
				<orda-metric-card label="Success rate" value="98.5" unit="%" />
				<orda-metric-card label="Success rate" value="98.5" unit="%" />
			</div>
		</div>
	`,
	styles: '',
})
export class DayComponent {
	statisticsService = inject(StatisticsService);
	currentDate = signal(new Date(Date.now()));

	from = signal(new Date(Date.now()));
	to = signal(new Date(Date.now()));

	transactionDates = rxResource({
		stream: () => this.statisticsService.getTransactionsDates(),
		defaultValue: [],
	});

	protected changed(range: OrdaDateRange) {
		this.from.set(range.from);
		this.to.set(range.to);
	}
}
