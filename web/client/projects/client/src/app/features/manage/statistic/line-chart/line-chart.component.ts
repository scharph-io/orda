import { Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset, ChartOptions, Point } from "chart.js";


@Component({
	selector: 'orda-line-chart',
	imports: [BaseChartDirective],
	template: `
	<div style="display: block;">
		<canvas baseChart width="400" height="400"
			[type]="'line'"
			[data]="lineChartData()"
			[options]="lineChartOptions"
			[legend]="lineChartLegend">
		</canvas>
	</div>

	`,
	styleUrl: './line-chart.component.scss',
})
export class LineChartComponent {

	datasets = input.required<ChartDataset<"line", (number | Point | null)[]>[]>();
	labels = input.required<string[]>();

	lineChartData = computed((): ChartConfiguration<'line'>['data'] => {
		return {
			labels: this.labels(),
			datasets: this.datasets()
		};
	});

	public lineChartOptions: ChartOptions<'line'> = {
		responsive: false
	};
	public lineChartLegend = true;

}
