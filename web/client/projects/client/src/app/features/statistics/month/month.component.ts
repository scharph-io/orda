import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MonthPickerComponent } from '@orda.shared/components/date-pickers/month-picker/month-picker.component';
import { DashboardComponent } from '@orda.features/statistics/dashboard/dashboard.component';

@Component({
	selector: 'orda-month',
	imports: [MonthPickerComponent, DashboardComponent],
	template: `
		<orda-month-picker
			(fromChange)="from.set($event)"
			[from]="from()"
			(toChange)="to.set($event)"
			[to]="to()"
		/>
		<orda-dashboard [msg]="monthString()" [from]="from()" [to]="to()" />
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
		return x !== null && x !== undefined ? parseInt(x)-1 : new Date().getMonth();
	});
	monthString = computed(() =>
		new Date(2000, this.monthIndex(), 1).toLocaleString('de', { month: 'long' }),
	);

	from = signal(new Date(this.year(), this.monthIndex(), 1));
	to = signal(new Date(this.year(), this.monthIndex() + 1, 0));
}
