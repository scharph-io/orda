import { Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset, ChartOptions, Point } from 'chart.js';

@Component({
	selector: 'orda-line-chart',
	imports: [BaseChartDirective],
	template: `
		<div style="display: block;">
			<canvas
				baseChart
				width="500"
				height="500"
				[type]="'line'"
				[data]="lineChartData()"
				[options]="lineChartOptions"
				[legend]="lineChartLegend"
			>
			</canvas>
		</div>
	`,
	styleUrl: './line-chart.component.scss',
})
export class LineChartComponent {
	chartTitle = input('Statistics');

	datasets = input.required<ChartDataset<'line', (number | Point | null)[]>[]>();
	labels = input.required<string[]>();

	lineChartData = computed((): ChartConfiguration<'line'>['data'] => ({
		labels: this.labels(),
		datasets: this.datasets(),
	}));

	public lineChartOptions: ChartOptions<'line'> = {
		responsive: false,
		interaction: {
			mode: 'index',
			intersect: false,
		},
		plugins: {
			title: {
				display: true,
				text: this.chartTitle(),
			},
		},
		scales: {
			y: {
				type: 'linear',
				display: true,
				position: 'left',
			},
		},
	};
	public lineChartLegend = true;
}
