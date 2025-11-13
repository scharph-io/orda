import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MonthPickerComponent } from '@orda.shared/components/date-pickers/month-picker/month-picker.component';
import { OrdaDateRange } from '@orda.shared/components/date-pickers/day-picker/day-picker.component';
import { DashboardComponent } from '@orda.features/statistics/dashboard/dashboard.component';

@Component({
	selector: 'orda-month',
	imports: [MonthPickerComponent, DashboardComponent],
	template: `
		<orda-month-picker
			(datesChanged)="changed($event)"
			[year]="year()"
			[monthIndex]="monthIndex()"
		/>
		<orda-dashboard [msg]="monthString().toString()" [from]="from()" [to]="to()" />
	`,
	styleUrls: ['./month.component.scss'],
})
export class MonthComponent {
	queryMap = toSignal(inject(ActivatedRoute).queryParamMap);
	year = computed(() => {
		const x = this.queryMap()?.get('y');
		return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear();
	});
	monthIndex = computed(() => {
		const x = this.queryMap()?.get('m');
		return x !== null && x !== undefined ? parseInt(x) - 1 : new Date().getMonth();
	});
	from = signal(new Date());
	monthString = computed(() =>
		new Date(2000, this.from().getMonth(), 1).toLocaleString('de', { month: 'long' }),
	);
	to = signal(new Date());

	public changed(range: OrdaDateRange) {
		this.from.set(range.from);
		this.to.set(range.to);
	}
}
