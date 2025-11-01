import { Component, computed, inject } from '@angular/core';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { AssortmentProduct } from '@orda.core/models/assortment';
import { EMPTY, map } from 'rxjs';
import { LineChartComponent } from '@orda.features/manage/statistic/line-chart/line-chart.component';
import { ChartDataset, Point } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
	selector: 'orda-statistic',
	imports: [
		LineChartComponent,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule,
		ReactiveFormsModule,
	],
	template: `

		<mat-form-field>
			<mat-label>Produkte</mat-label>
			<mat-select [formControl]="selectedProductsControl" multiple>
				@for (p of products(); track p.id) {
						@let desc = p.desc ? '('+p.desc+')' : '';
						<mat-option [value]="p">{{p.name}} {{desc}}</mat-option>
				}
			</mat-select>
		</mat-form-field>

		<button type="reset" (click)="selectedProductsControl.reset()">Reset</button>

		@if (selectedProducts().length > 0) {
			<orda-line-chart [datasets]="datasetsLineChart()" [labels]="labels()" [chartTitle]="'Verkäufe nach Datum'"></orda-line-chart>
		}
	`,
	styles: ``,
})
export class StatisticComponent {
	assortmentService = inject(AssortmentService);
	statisticsService = inject(StatisticsService);

	selectedProductsControl = new FormControl<AssortmentProduct[]>([]);

	products = toSignal(
		this.assortmentService.readProducts(),
		// .pipe(map((x) => x.filter((f) => f.name.includes('B')))),
	);

	selectedProducts = toSignal(
		this.selectedProductsControl.valueChanges.pipe(map(p => p !== null ? p : [])),
		{ initialValue: [] },
	);
	datasets = rxResource({
		params: () => this.selectedProducts(),
		stream: ({ params }) => {
			if (params.length === 0) return EMPTY;
			return this.statisticsService.getProductsQuantitiesDataset(params.map((p) => p.id));
		},
	});

	datasetsLineChart = computed(() => {
		if (!this.datasets.hasValue()) {
			return [];
		}

		return this.datasets.value().datasets.map((ds) => {
			const p = this.selectedProducts().find((p) => p.id === ds.product_id);
			return {
				data: ds.dataset,
				label: p ? `${p.name} (${p.desc})` : 'Unknown product',
				fill: true,
				tension: 0.5,
			} as ChartDataset<'line', (number | Point | null)[]>;
		});
	});

	labels = computed((): string[] => {
		if (!this.datasets.hasValue()) {
			return [];
		}
		const stats = this.datasets.value();
		return stats ? stats.dates.map((d) => new Date(d).toLocaleDateString()) : [];
	});
}
