import { Component, computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
	MatDatepicker,
	MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatButtonModule, } from '@angular/material/button';
import { MatInputModule, } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
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
		return date.toLocaleString(this.locale, { year: 'numeric' });
	}
}

@Component({
  selector: 'orda-year',
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatIconModule,
		FormsModule,
		MatButtonModule,
	],
	providers: [
		provideNativeDateAdapter(),
		{provide: DateAdapter, useClass: CustomDateAdapter}
	],
  template: `
		<div class="orda-date-picker">
			<mat-form-field class="statistics-date-form-field">
				<input matInput
							 [matDatepicker]="dp"
							 disabled
							 [value]="from()">
				<mat-datepicker #dp
												startView="multi-year" touchUi
												(yearSelected)="chosenYearHandler($event, dp)"
												panelClass="month-picker"
												disabled="false">
				</mat-datepicker>
				<mat-datepicker-toggle matIconSuffix [for]="dp" ></mat-datepicker-toggle>


			</mat-form-field>
			<p>{{from().toLocaleDateString()}}</p>
			<p>{{ to().toLocaleDateString()}}</p>
		</div>


  `,
  styleUrl: './year.component.scss',
})
export class YearComponent {
	queryMap = toSignal(inject(ActivatedRoute).queryParamMap);
	year = computed(() => {
		const x = this.queryMap()?.get('y')
		return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear()});

	chosenYearHandler(normalizedYear: Date,datepicker: MatDatepicker<Date>) {
		this._from.update((d) => new Date(normalizedYear.getFullYear(), d.getMonth(), 1));
		this.from.set(this._from())
		datepicker.close();
	}

	private _from = signal(new Date(this.year(), 0, 1));
	from = linkedSignal(() => new Date(this.year(), 0, 1))
	to = computed(() => new Date(this.from().getFullYear(), 12, 0));


}
