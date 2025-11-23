import { Component, inject, Injectable, model } from '@angular/core';
import {
	MatDatepicker,
	MatDatepickerInput,
	MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
	DateAdapter,
	MAT_DATE_LOCALE,
	NativeDateAdapter,
	provideNativeDateAdapter,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
	override locale = inject<string>(MAT_DATE_LOCALE);
	override format(date: Date): string {
		return date.toLocaleDateString(this.locale, { year: 'numeric', month: 'long' });
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
		MatButtonModule,
		MatIcon,
	],
	providers: [
		provideNativeDateAdapter(),
		{
			provide: DateAdapter,
			useClass: CustomDateAdapter,
		},
	],
	template: `
		<button [style.margin-top]="'0.5rem'" matIconButton (click)="add(-1)">
			<mat-icon>chevron_left</mat-icon>
		</button>
		<mat-form-field>
			<input matInput [matDatepicker]="dp" [value]="from()" disabled />
			<mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
			<mat-datepicker
				#dp
				startView="multi-year"
				touchUi
				(monthSelected)="chosenMonthHandler($event, dp)"
				disabled="false"
				panelClass="picker"
			/>
		</mat-form-field>
		<button [style.margin-top]="'0.5rem'" matIconButton aria-label="Prev" (click)="add(1)">
			<mat-icon>chevron_right</mat-icon>
		</button>
	`,
	styleUrls: ['./month-picker.component.scss'],
})
export class MonthPickerComponent {

	from = model.required<Date>();
	to = model.required<Date>();

	chosenMonthHandler(normalizedMonth: Date, dp: MatDatepicker<Date>) {
		this.from.set(new Date(normalizedMonth.getFullYear(), normalizedMonth.getMonth(), 1));
		this.to.set(new Date(normalizedMonth.getFullYear(), normalizedMonth.getMonth() + 1, 0));
		dp.close();
	}

	protected add(months: number) {
		this.from.update((d) => {
			const curr = new Date(d);
			curr.setMonth(curr.getMonth() + months);
			return curr;
		});
		this.to.update((d) => {
			const curr = new Date(d);
			curr.setMonth(curr.getMonth() + months);
			return curr;
		});
	}
}
