import { Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ViewProduct } from '@orda.core/models/view';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

@Component({
	selector: 'orda-product-tile',
	standalone: true,
	imports: [OrdaCurrencyPipe, MatDividerModule, OrdaCurrencyPipe],
	template: `
		<div class="item-0">{{ product().name }}</div>
		<div class="item-1">{{ product().desc }}</div>
		<div class="item-2"><mat-divider></mat-divider></div>
		<div class="item-3">{{ product().price | currency }}</div>
	`,
	styles: [
		`
			:host {
				display: flex;
				gap: 0.25rem;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				align-content: flex-end;
				width: 90%;
			}

			.item-0 {
				flex-grow: 2;
				font-size: 1.2rem;
				font-weight: bold;
				text-align: center;
			}

			.item-1 {
				flex-grow: 1;
				min-height: 1rem;
				font-size: 0.9rem;
				text-align: center;
			}

			.item-2 {
				flex-grow: 1;
				height: 100%;
				width: 80%;
			}

			.item-3 {
				flex-grow: 2;
				font-size: 1.1rem;
				font-weight: bold;
			}
		`,
	],
})
export class ProductTileComponent {
	product = input.required<Partial<ViewProduct>>();
}
