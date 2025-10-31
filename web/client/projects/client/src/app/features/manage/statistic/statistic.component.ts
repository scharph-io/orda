import { Component, computed, inject, signal } from '@angular/core';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { AssortmentProduct } from '@orda.core/models/assortment';
import { EMPTY, map } from 'rxjs';
import { LineChartComponent } from '@orda.features/manage/statistic/line-chart/line-chart.component';
import { JsonPipe } from '@angular/common';
import { ChartDataset, Point } from 'chart.js';


@Component({
	selector: 'orda-statistic',
	imports: [LineChartComponent, JsonPipe],
	template: `
		@for (p of products(); track p.id) {
			<p>{{ p.name }} {{ p.desc }} <button (click)="addSelectedProduct(p)">Select</button><button (click)="removeSelectedProduct(p)">Remove</button></p>
		}

		{{ selectedProducts().length}} products selected.

		@if(datasets.hasValue()) {
			<pre><code>{{ datasets.value() | json}}</code></pre>
			<pre><code>{{ datasetsLineChart() | json}}</code></pre>
		}

		 <orda-line-chart [datasets]="datasetsLineChart()" [labels]="[]"></orda-line-chart>

	`,
	styles: ``,
})
export class StatisticComponent {
	assortmentService = inject(AssortmentService);
	statisticsService = inject(StatisticsService);

	products = toSignal(
		this.assortmentService
			.readProducts()
			.pipe(map((x) => x.filter((f) => f.name.includes('A') || f.name.includes('B')))),
	);

	selectedProducts = signal<AssortmentProduct[]>([]);

	addSelectedProduct(p: AssortmentProduct) {
		if (this.selectedProducts().find(f => f.id === p.id)) {
			return;
		}
		const current = this.selectedProducts();
		this.selectedProducts.set([...current, p]);
	}

	removeSelectedProduct(p: AssortmentProduct) {
		const current = this.selectedProducts();
		this.selectedProducts.set(current.filter(f => f.id !== p.id));
	}


	datasets = rxResource({
		params: () => this.selectedProducts(),
		stream: ({ params }) => {
			if (params.length === 0) return EMPTY;
			return this.statisticsService.getProductsQuantitiesDataset(params.map(p => p.id));
		},
	});

	datasetsLineChart = computed(() => {
		if (!this.datasets.hasValue()) {
			return [];
		}
		return this.datasets.value().data.map((ds) => {
			const product = this.selectedProducts().find((p) => p.id === ds.product_id);
			return {
				data: ds.dataset.map((d) => d.total_qty),
				label: product ? product.name : 'Unknown product',
				fill: true,
				tension: 0.5,
			} as ChartDataset<'line', (number | Point | null)[]>;
		});
	});


		// labels = computed((): string[] => {
		// 	if (!this.datasets.hasValue()) {
		// 		return [];
		// 	}
		// 	// const stats = this.stats1.value();
		// 	// return stats ? stats.data.map(d => new Date(d.reporting_day).toLocaleDateString()) : [];
		// 	return this.datasets.value().data.map((ds) => ds.dataset.map((d) => d.reporting_day));
		// });


}
