import { Component, computed, inject } from '@angular/core';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { AssortmentProduct } from '@orda.core/models/assortment';
import { EMPTY, map } from 'rxjs';
import { LineChartComponent } from '@orda.features/statistics/line-chart/line-chart.component';
import { ChartDataset, Point } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { StatsCardComponent } from '@orda.shared/components/stats-card/stats-card.component';
import { MetricCardComponent } from '@orda.shared/components/metric-card/metric-card.component';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'orda-statistic',
	imports: [
		LineChartComponent,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule,
		ReactiveFormsModule,
		DatePipe,
		MatTabsModule,
		StatsCardComponent,
		MetricCardComponent,
		RouterModule,
		JsonPipe,
	],
	template: `
		<div class="page">
			<!--			<pre>{{quantities.value() | json}}</pre>-->

			<nav
				mat-stretch-tabs="false"
				mat-tab-nav-bar
				[tabPanel]="panel"
				class="tabs-header"
				mat-align-tabs="center"
			>
				<a
					mat-tab-link
					[routerLink]="['day']"
					routerLinkActive
					#rla1="routerLinkActive"
					[active]="rla1.isActive"
					>Day</a
				>
				<a
					mat-tab-link
					[routerLink]="['month']"
					routerLinkActive
					#rla2="routerLinkActive"
					[active]="rla2.isActive"
					>Month</a
				>
				<a
					mat-tab-link
					[routerLink]="['year']"
					routerLinkActive
					#rla3="routerLinkActive"
					[active]="rla3.isActive"
					>Year</a
				>
			</nav>

			<mat-tab-nav-panel #panel class="tabs-panel">
				<router-outlet></router-outlet>
			</mat-tab-nav-panel>
		</div>

		<!--		<mat-tab-group mat-stretch-tabs="false" mat-align-tabs="center" dynamicHeight>-->
		<!--			<mat-tab label="Current">-->
		<!--				&lt;!&ndash;				<h1>Test</h1>&ndash;&gt;-->
		<!--				&lt;!&ndash;				<orda-stats-card/>&ndash;&gt;-->
		<!--				<div class="dashboard-grid">-->
		<!--					<orda-metric-card label="Success rate" value="98.5" unit="%"/>-->
		<!--					<orda-metric-card label="Success rate" value="98.5" unit="%"/>-->
		<!--					<orda-metric-card label="Success rate" value="98.5" unit="%"/>-->
		<!--					<orda-metric-card label="Success rate" value="98.5" unit="%"/>-->
		<!--				</div>-->
		<!--			</mat-tab>-->
		<!--			<mat-tab label="Month">Content 2</mat-tab>-->
		<!--			<mat-tab label="Year">Content 3</mat-tab>-->
		<!--		</mat-tab-group>-->

		<!--		<orda-stats-card/>-->

		<!--		{{ 1 | date : 'MMMM'}}-->

		<!--		<mat-form-field>-->
		<!--			<mat-label>Produkte</mat-label>-->
		<!--			<mat-select [formControl]="selectedProductsControl" multiple>-->
		<!--				@for (p of products(); track p.id) {-->
		<!--						@let desc = p.desc ? '('+p.desc+')' : '';-->
		<!--						<mat-option [value]="p">{{p.name}} {{desc}}</mat-option>-->
		<!--				}-->
		<!--			</mat-select>-->
		<!--		</mat-form-field>-->

		<!--		<button type="reset" (click)="selectedProductsControl.reset()">Reset</button>-->

		<!--		@if (selectedProducts().length > 0) {-->
		<!--			<orda-line-chart [datasets]="datasetsLineChart()" [labels]="labels()" [chartTitle]="'Verkäufe nach Datum'"></orda-line-chart>-->
		<!--		}-->
	`,
	styleUrls: ['./statistic.component.scss'],
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
		this.selectedProductsControl.valueChanges.pipe(map((p) => (p !== null ? p : []))),
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

	quantities = rxResource({
		stream: () => this.statisticsService.getTransactionsQuantities(),
	});
}
