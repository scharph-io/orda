import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { OrdaDateRange } from '@orda.shared/components/date-pickers/day-picker/day-picker.component';
import { YearPickerComponent } from '@orda.shared/components/date-pickers/year-picker/year-picker.component';
import { ContainerComponent } from '@orda.features/statistics/container/container.component';

@Component({
	selector: 'orda-year',
	imports: [YearPickerComponent, ContainerComponent],
	template: `
		<orda-year-picker [year]="year()" (datesChanged)="changed($event)" />
		<orda-container [msg]="year().toString()" [from]="from()" [to]="to()" />
	`,
	styleUrls: ['./year.component.scss'],
})
export class YearComponent {
	queryMap = toSignal(inject(ActivatedRoute).queryParamMap);

	year = computed(() => {
		const x = this.queryMap()?.get('y');
		return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear();
	});

	from = signal(new Date());
	to = signal(new Date());

	public changed(range: OrdaDateRange) {
		this.from.set(range.from);
		this.to.set(range.to);
	}
}
