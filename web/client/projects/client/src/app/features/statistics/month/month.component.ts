import {
	Component,
	computed,
	inject,
	Injectable,
	linkedSignal,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	DateAdapter,
	MAT_DATE_LOCALE,
	NativeDateAdapter,
	provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatButtonModule } from '@angular/material/button';

@Injectable()
class CustomDateAdapter extends NativeDateAdapter {
	override locale = inject<string>(MAT_DATE_LOCALE);
	override format(date: Date): string {
		return date.toLocaleString(this.locale, { month: 'long', year: 'numeric' });
	}
}

@Component({
  selector: 'orda-month',
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
			<mat-form-field>
				<input matInput
							 [matDatepicker]="dp"
							 [value]="from()"
							 disabled>
				<mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
				<mat-datepicker #dp
												startView="multi-year" touchUi
												(yearSelected)="chosenYearHandler($event)"
												(monthSelected)="chosenMonthHandler($event, dp)"
												disabled="false"
												panelClass="month-picker">
				</mat-datepicker>
			</mat-form-field>
			<p>{{monthString()}}</p>
			<p>{{from().toLocaleDateString()}}</p>
			<p>{{ to().toLocaleDateString()}}</p>
		</div>


	`,
  styleUrl: './month.component.scss',
	encapsulation: ViewEncapsulation.None,


})
export class MonthComponent {

	locale = inject<string>(MAT_DATE_LOCALE);
	private queryMap = toSignal(inject(ActivatedRoute).queryParamMap);

	year = computed(() => {
		const x = this.queryMap()?.get('y')
		return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear()});
	month = computed(() => {
		const x = this.queryMap()?.get('m')
		return x !== null && x !== undefined ? parseInt(x) : new Date().getMonth() +1});

	monthString = computed(() => new Date(2000, this.month() -1, 1).toLocaleString(this.locale, { month: 'long' }));

	chosenYearHandler(normalizedYear: Date) {
		this._from.update((d) => new Date(normalizedYear.getFullYear(), d.getMonth(), 1));
	}
	chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
		this._from.update((d) => new Date(d.getFullYear(), normalizedMonth.getMonth(), 1));
		this.from.set(this._from())
		datepicker.close();
	}

	private _from = signal( new Date(this.year(), this.month() - 1, 1));
	from = linkedSignal(()=>new Date(this.year(), this.month() - 1, 1));
	to = computed(() => new Date(this.from().getFullYear(), this.from().getMonth() + 1, 0));


}
