import { Component, inject, signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import {
	OrdaDateRange,
	OrdaDayPickerComponent,
} from '@orda.shared/components/date-pickers/day-picker/day-picker.component';
import { DashboardComponent } from '@orda.features/statistics/dashboard/dashboard.component';

@Component({
	selector: 'orda-day',
	imports: [OrdaDayPickerComponent, DashboardComponent],
	providers: [provideNativeDateAdapter()],
	template: `
		<orda-day-picker
			[from]="currentDate()"
			[datesAllowed]="transactionDates.value()"
			(datesChanged)="changed($event)"
		/>
		<orda-dashboard [msg]="currentDate().toLocaleDateString()" [from]="from()" [to]="to()" />
	`,
	styleUrls: ['./day.component.scss'],
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
