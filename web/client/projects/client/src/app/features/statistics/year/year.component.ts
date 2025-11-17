import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { YearPickerComponent } from '@orda.shared/components/date-pickers/year-picker/year-picker.component';
import { DashboardComponent } from '@orda.features/statistics/dashboard/dashboard.component';

@Component({
	selector: 'orda-year',
	imports: [YearPickerComponent, DashboardComponent],
	template: `
		<orda-year-picker
			[year]="year()"
			(fromChange)="from.set($event)"
			[from]="from()"
			(toChange)="to.set($event)"
			[to]="to()"
		/>
		<orda-dashboard [msg]="year().toString()" [from]="from()" [to]="to()" />
	`,
	styleUrls: ['./year.component.scss'],
})
export class YearComponent {
	queryMap = toSignal(inject(ActivatedRoute).queryParamMap);
	year = computed(() => {
		const x = this.queryMap()?.get('y');
		return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear();
	});

	current = signal(new Date());
	from = signal(new Date(this.current().getFullYear(), 0, 1));
	to = signal(new Date(this.current().getFullYear() + 1, 0, 0));

}
