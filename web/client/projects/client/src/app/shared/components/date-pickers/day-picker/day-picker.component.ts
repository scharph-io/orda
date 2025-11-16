import { Component, effect, input, linkedSignal, output } from '@angular/core';
import {
	MatCalendarCellClassFunction,
	MatDatepicker,
	MatDatepickerInput,
	MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatInput, MatSuffix } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

export interface OrdaDateRange {
	from: Date;
	to: Date;
}

@Component({
	selector: 'orda-day-picker',
	imports: [
		MatDatepicker,
		MatDatepickerInput,
		MatDatepickerToggle,
		MatFormField,
		MatInput,
		MatSuffix,
		ReactiveFormsModule,
		FormsModule,
		MatIcon,
		MatIconButton,
		MatButtonModule,
	],
	template: `
		<button [style.margin-top]="'0.5rem'" matIconButton aria-label="Prev" (click)="add(-1)">
			<mat-icon>chevron_left</mat-icon>
		</button>
		<mat-form-field>
			<input
				matInput
				[matDatepickerFilter]="filter"
				[matDatepicker]="dp"
				(ngModelChange)="_from.set($event)"
				[ngModel]="from()"
				disabled
			/>
			<mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
			<mat-datepicker touchUi [dateClass]="dateClass" #dp disabled="false"></mat-datepicker>
		</mat-form-field>
		<button [style.margin-top]="'0.5rem'" matIconButton aria-label="Prev" (click)="add(1)">
			<mat-icon>chevron_right</mat-icon>
		</button>
	`,
	styleUrls: ['./day-picker.component.scss'],
})
export class OrdaDayPickerComponent {
	from = input(new Date());
	_from = linkedSignal(() => {
		this.from().setHours(0,0,0,0)
		return this.from()
	});

	datesAllowed = input<Date[]>([]);
	datesChanged = output<OrdaDateRange>();

	constructor() {
		effect(() => {
			this.datesChanged.emit({
				from: this._from(),
				to: new Date(
					this._from().getFullYear(),
					this._from().getMonth(),
					this._from().getDate() + 1,
				),
			});
		});
	}

	protected filter = (d: Date | null): boolean => {
		const day = d || new Date();
		return this.validDate(day);
	};

	protected dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
		if (view === 'month') {
			return this.validDate(cellDate) ? 'custom-date-class' : '';
		}
		return '';
	};

	protected add(days: number) {
		this._from.update((d) => {
			const curr = new Date(d);
			curr.setDate(curr.getDate() + days);
			return curr;
		});
	}

	private validDate(day: Date) {
		return (
			this.datesAllowed().some((d) => d.getTime() === day.getTime()) ||
			day.getTime() === new Date(new Date().setHours(0, 0, 0, 0)).getTime()
		);
	}
}
