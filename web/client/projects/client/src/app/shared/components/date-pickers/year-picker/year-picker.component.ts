import { Component, effect, inject, Injectable, input, linkedSignal, output } from '@angular/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle, } from '@angular/material/datepicker';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { OrdaDateRange } from '@orda.shared/components/date-pickers/day-picker/day-picker.component';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter, provideNativeDateAdapter, } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
	override locale = inject<string>(MAT_DATE_LOCALE);
	override format(date: Date): string {
		return date.toLocaleDateString(this.locale, { year: 'numeric' });
	}
}

@Component({
	selector: 'orda-year-picker',
	imports: [
		MatDatepicker,
		MatDatepickerInput,
		MatDatepickerToggle,
		MatFormField,
		MatInput,
		MatSuffix,
		MatIconModule,
		MatButtonModule
	],
	providers: [
		provideNativeDateAdapter(),
		{
			provide: DateAdapter,
			useClass: CustomDateAdapter,
		},
	],
	template: `
		<button [style.margin-top]="'0.5rem'" matIconButton aria-label="Prev" (click)="add(-1)">
			<mat-icon>chevron_left</mat-icon>
		</button>
		<mat-form-field>
			<input matInput [matDatepicker]="dp" [value]="from()" disabled />
			<mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
			<mat-datepicker
				#dp
				startView="multi-year"
				touchUi
				(yearSelected)="chosenYearHandler($event, dp)"
				disabled="false"
				panelClass="picker"
			/>
		</mat-form-field>
		<button [style.margin-top]="'0.5rem'" matIconButton aria-label="Next" (click)="add(1)">
        	<mat-icon>chevron_right</mat-icon>
		</button>
	`,
	styleUrls: ['./year-picker.component.scss'],
})
export class YearPickerComponent {
	year = input(new Date().getFullYear());

	datesChanged = output<OrdaDateRange>();

	constructor() {
		effect(() => {
			this.datesChanged.emit({
				from: this.from(),
				to: new Date(this.from().getFullYear() + 1, 0, 0),
			});
		});
	}

	chosenYearHandler(normalizedYear: Date, dp: MatDatepicker<Date>) {
		this.from.update(() => new Date(normalizedYear.getFullYear(), 0, 1));
		dp.close()
	}

	protected from = linkedSignal(() => new Date(this.year(), 0, 1));

	protected add(years: number) {
		this.from.update((d) => {
			const curr = new Date(d);
			curr.setFullYear(curr.getFullYear() + years);
			return curr;
		});
	}
}
