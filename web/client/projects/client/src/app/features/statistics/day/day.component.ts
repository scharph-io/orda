import { Component, inject, signal } from '@angular/core';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'orda-day',
	imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, FormsModule],
	providers: [provideNativeDateAdapter()],
	template: `
		<mat-form-field>
			<mat-label>Choose a date</mat-label>
			<input
				matInput
				[matDatepickerFilter]="filter"
				[matDatepicker]="picker"
				(ngModelChange)="currentDate.set($event)"
				[ngModel]="currentDate()"
			/>
			<mat-hint>MM/DD/YYYY</mat-hint>
			<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
			<mat-datepicker [dateClass]="dateClass" #picker></mat-datepicker>
		</mat-form-field>

		{{ currentDate() }}
	`,
	styleUrl: './day.component.scss',
})
export class DayComponent {
	statisticsService = inject(StatisticsService);

	currentDate = signal(new Date(Date.now()));

	allDates = rxResource({
		stream: () => this.statisticsService.getTransactionsDates(),
		defaultValue: [],
	});

	protected dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
		if (view === 'month') {
			return this.validDate(cellDate) ? 'example-custom-date-class' : '';
		}
		return '';
	};

	filter = (d: Date | null): boolean => {
		const day = d || new Date();
		// Prevent Saturday and Sunday from being selected.
		return this.validDate(day);
	};

	private validDate(day: Date) {
		return (
			this.allDates.value().some((d) => d.getTime() === day.getTime()) ||
			day.getTime() === new Date(new Date().setHours(0, 0, 0, 0)).getTime()
		);
	}
}
