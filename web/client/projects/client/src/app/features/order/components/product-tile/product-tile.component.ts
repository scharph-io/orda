import { Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ViewProduct } from '@orda.core/models/view';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

@Component({
	selector: 'orda-product-tile',
	standalone: true,
	imports: [OrdaCurrencyPipe, MatDividerModule, OrdaCurrencyPipe],
	template: `
		<div class="price">{{ product().price | currency }}</div>
		<div class="divider"><mat-divider></mat-divider></div>
		<div class="desc">{{ product().desc }}</div>
		<div class="name">{{ product().name }}</div>
	`,
	styles: [
		`
			:host {
				display: grid;
				grid-template-columns: 1fr;
				grid-template-rows: 1fr 1fr 5% 20%;
				gap: 0 0;
				grid-auto-flow: row;
				grid-template-areas:
					'name'
					'desc'
					'divider'
					'price';
			}

			.price {
				grid-area: price;
				text-align: center;
			}

			.divider {
				grid-area: divider;
			}

			.desc {
				grid-area: desc;
				font-size: 0.8em;
				text-align: center;
			}

			.name {
				grid-area: name;
				text-align: center;
			}
		`,
	],
})
export class ProductTileComponent {
	product = input.required<ViewProduct>();
}
