import { Component, effect, inject, Injectable, input, linkedSignal, output } from '@angular/core';
import {
	MatDatepicker,
	MatDatepickerInput,
	MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { OrdaDateRange } from '@orda.shared/components/date-pickers/day-picker/day-picker.component';
import {
	DateAdapter,
	MAT_DATE_LOCALE,
	NativeDateAdapter,
	provideNativeDateAdapter,
} from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
	override locale = inject<string>(MAT_DATE_LOCALE);
	override format(date: Date): string {
		return date.toLocaleDateString(this.locale, {year: 'numeric', month: 'long'});
	}
}

@Component({
	selector: 'orda-month-picker',
	imports: [
		MatDatepicker,
		MatDatepickerInput,
		MatDatepickerToggle,
		MatFormField,
		MatInput,
		MatSuffix,
	],
	providers: [
		provideNativeDateAdapter(),
		{
			provide: DateAdapter,
			useClass: CustomDateAdapter,
		}
	],
	template: `
		<mat-form-field>
			<input matInput [matDatepicker]="dp" [value]="from()" disabled />
			<mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
			<mat-datepicker
				#dp
				startView="multi-year"
				touchUi
				(yearSelected)="chosenYearHandler($event)"
				(monthSelected)="chosenMonthHandler($event, dp)"
				disabled="false"
				panelClass="month-picker"
			>
			</mat-datepicker>
		</mat-form-field>
		<button (click)="add(1)">Next</button>
		<button (click)="add(-1)">Prev</button>
	`,
	styles: ``,
})
export class MonthPickerComponent {
	monthIndex = input(new Date().getMonth());
	year = input(new Date().getFullYear());

	datesChanged = output<OrdaDateRange>();

	constructor() {
		effect(() => {
			this.datesChanged.emit({
				from: this.from(),
				to: new Date(this.from().getFullYear(), this.from().getMonth() + 1, 0),
			});
		});
	}

	chosenYearHandler(normalizedYear: Date) {
		this.from.update((d) => new Date(normalizedYear.getFullYear(), d.getMonth(), 1));
	}
	chosenMonthHandler(normalizedMonth: Date, dp: MatDatepicker<Date>) {
		this.from.update((d) => new Date(d.getFullYear(), normalizedMonth.getMonth(), 1));
		dp.close();
	}

	protected from = linkedSignal(() => new Date(this.year(), this.monthIndex(), 1));

	protected add(months: number) {
		this.from.update((d) => {
			const curr = new Date(d);
			curr.setMonth(curr.getMonth() + months);
			return curr;
		});
	}
}
