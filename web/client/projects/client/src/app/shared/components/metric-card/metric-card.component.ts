import { Component, input } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
	selector: 'orda-metric-card',
	imports: [MatProgressSpinnerModule],
	template: `
		<div class="metric-card">
		@if(!loading()) {
				<div class="metric-card__label">{{ label() }}</div>
				<div class="metric-card__value">
					@if(value()) {
						{{ value() }}
					} @else {
						-
					}
					@if (unit()) {
						<span class="metric-card__unit">{{ unit() }}</span>
					}
				</div>
		} @else {
			<mat-spinner></mat-spinner>
		}
		</div>
	`,
	styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
	label = input.required();
	value = input<string | null>();
	unit = input();
	loading = input(false)
}
