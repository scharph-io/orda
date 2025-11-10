import { Component, inject, signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import {
	OrdaDateRange,
	OrdaDayPickerComponent,
} from '@orda.shared/components/date-pickers/day-picker/day-picker.component';

@Component({
	selector: 'orda-day',
	imports: [OrdaDayPickerComponent],
	providers: [provideNativeDateAdapter()],
	template: `
		<div class="orda-date-picker">
			<orda-day-picker [from]="currentDate()" [datesAllowed]="allDates.value()" (datesChanged)="changed($event)"/>
			{{from().toLocaleDateString()}}
			{{to().toLocaleDateString()}}
		</div>
	`,
	styles: '',
})
export class DayComponent {
	statisticsService = inject(StatisticsService);
	currentDate = signal(new Date(Date.now()));

	from = signal(new Date(Date.now()));
	to = signal(new Date(Date.now()));

	allDates = rxResource({
		stream: () => this.statisticsService.getTransactionsDates(),
		defaultValue: [],
	});

	protected changed(range: OrdaDateRange) {
		this.from.set(range.from)
		this.to.set(range.to)
	}
}
