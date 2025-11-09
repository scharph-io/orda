import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MonthPickerComponent } from '@orda.shared/components/date-pickers/month-picker/month-picker.component';
import { OrdaDateRange } from '@orda.shared/components/date-pickers/day-picker/day-picker.component';

@Component({
	selector: 'orda-month',
	imports: [MonthPickerComponent],
	template: `
		<orda-month-picker (datesChanged)="changed($event)" [year]="year()" [monthIndex]="monthIndex()"/>
		<p>
			{{ monthString() }}
			{{ from().toLocaleDateString() }}
			{{ to().toLocaleDateString() }}
		</p>
	`,
	styleUrl: './month.component.scss',
})
export class MonthComponent {
	queryMap = toSignal(inject(ActivatedRoute).queryParamMap);
	year = computed(() => {
		const x = this.queryMap()?.get('y');
		return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear();
	});
	monthIndex = computed(() => {
		const x = this.queryMap()?.get('m');
		return x !== null && x !== undefined ? parseInt(x)-1 : new Date().getMonth();
	});
	monthString = computed(() =>
		new Date(2000, this.from().getMonth(), 1).toLocaleString('de', { month: 'long' }),
	);

	from = signal(new Date());
	to = signal(new Date());

	public changed(range: OrdaDateRange) {
		this.from.set(range.from)
		this.to.set(range.to)
	}
}
