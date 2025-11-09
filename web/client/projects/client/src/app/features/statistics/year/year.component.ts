import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'orda-year',
	imports: [],
	template: ` <p>year works! {{ queryYear() }}</p> `,
	styleUrl: './year.component.scss',
})
export class YearComponent {
	queryMap = toSignal(inject(ActivatedRoute).queryParamMap);
	queryYear = computed(() => {
		const x = this.queryMap()?.get('y');
		return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear();
	});
}
