import { Component, input } from '@angular/core';

@Component({
  selector: 'orda-metric-card',
  imports: [],
  template: `
		<!-- metric-card.component.html -->
		<div class="metric-card">
			<div class="metric-card__label">{{ label() }}</div>
			<div class="metric-card__value">
				{{ value() }}
				@if(unit()){
					<span class="metric-card__unit">{{ unit() }}</span>
				}
			</div>
		</div>

	`,
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
	label = input.required()
	value = input.required()
	unit = input()
}
