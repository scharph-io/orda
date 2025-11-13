import { Component, input } from '@angular/core';

@Component({
	selector: 'orda-dashboard',
	imports: [],
	template: `
		@for (x of arr; track x) {
			<div class="tile">
				{{ x }} => From {{ from().toLocaleDateString() }} to {{ to().toLocaleDateString() }}
				@if (msg()) {
					({{ msg() }})
				}
			</div>
		}
	`,
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
	msg = input<string>();

	from = input.required<Date>();
	to = input.required<Date>();
	public arr = [...Array(30).keys()].map((i) => i + 1);
}
