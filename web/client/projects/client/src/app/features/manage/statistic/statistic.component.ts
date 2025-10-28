import { Component, inject, signal } from '@angular/core';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { AssortmentProduct } from '@orda.core/models/assortment';
import { EMPTY, map } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { LineChartComponent } from '@orda.features/manage/statistic/line-chart/line-chart.component';


@Component({
	selector: 'orda-statistic',
	imports: [JsonPipe,LineChartComponent],
	template: `
		<p>statistic works!</p>

		@for (p of products(); track p.id) {
			<p>{{ p.name }} {{ p.desc }} <button (click)="selectProduct(p)">Select</button></p>
		}

		{{ stats1.value() | json }}
		<orda-line-chart/>

	`,
	styles: ``,
})
export class StatisticComponent {
	assortmentService = inject(AssortmentService);
	statisticsService = inject(StatisticsService);

	products = toSignal(
		this.assortmentService
			.readProducts()
			.pipe(map((x) => x.filter((f) => f.name.includes('Bier')))),
	);
	selectedProduct = signal<AssortmentProduct | undefined>(undefined);

	stats1 = rxResource({
		params: () => this.selectedProduct(),
		stream: ({ params }) => {
			if (!params) return EMPTY;
			return this.statisticsService.getProductQuantitiesByDateRange(params.id);
		},
	});

	selectProduct(p: AssortmentProduct) {
		this.selectedProduct.set(p);
	}

	multi: any[] = [];

	// options
	legend = true;
	showLabels = true;
	animations = true;
	xAxis = true;
	yAxis = true;
	showYAxisLabel = true;
	showXAxisLabel = true;
	xAxisLabel = 'Year';
	yAxisLabel = 'Population';
	timeline = true;

	colorScheme = {
		domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
	};
}
