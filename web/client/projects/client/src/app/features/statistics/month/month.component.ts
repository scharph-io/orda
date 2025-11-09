import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'orda-month',
	imports: [DatePipe],
	template: `
		<p>
			{{ monthString() }}
			{{ queryYear() }}
		</p>
	`,
	styleUrl: './month.component.scss',
})
export class MonthComponent {
	queryMap = toSignal(inject(ActivatedRoute).queryParamMap);
	queryYear = computed(() => {
		const x = this.queryMap()?.get('y');
		return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear();
	});
	queryMonth = computed(() => {
		const x = this.queryMap()?.get('m');
		return x !== null && x !== undefined ? parseInt(x) : new Date().getMonth() + 1;
	});
	monthString = computed(() =>
		new Date(2000, this.queryMonth() - 1, 1).toLocaleString('de', { month: 'long' }),
	);
}
