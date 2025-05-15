import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { ViewProduct } from '@orda.core/models/view';

@Component({
	selector: 'orda-plus-minus-tile',
	standalone: true,
	imports: [MatIconModule],
	template: `
		<div
			class="item add"
			(click)="addToCart(1)"
			(keyup)="addToCart(1)"
			[title]="deposit()"
			aria-hidden="true"
		>
			<!--			{{ key() }} <mat-icon>add</mat-icon>-->
			<!--			Pfand <mat-icon>add</mat-icon>-->
			<div class="tile-content">
				<mat-icon aria-hidden="false">add</mat-icon>
				<span class="tile-text">Pfand</span>
			</div>
		</div>
		<div class="item remove" (click)="addToCart(-1)" (keyup)="addToCart(-1)" aria-hidden="true">
			<!--      {{ key() }} <mat-icon>remove</mat-icon>-->
			<!--			Pfand <mat-icon>remove</mat-icon>-->
			<div class="tile-content">
				<mat-icon aria-hidden="false">remove</mat-icon>
				<span class="tile-text">Pfand</span>
			</div>
		</div>
	`,
	styles: [
		`
			:host {
				display: flex;
				flex-direction: row;
				height: 100%;
				width: 100%;
				gap: 0.5rem;
			}

			.item {
				flex-grow: 1;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.add {
				background-color: #2dc653;
				color: white;
			}

			.remove {
				background-color: #fe5f55;
				color: white;
			}

			mat-icon {
				height: 3rem;
				width: 3rem;
				font-size: 3rem;
			}

			.tile-content {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 100%;
			}

			.tile-text {
				margin-top: 0.25rem;
				font-size: 1.25rem;
			}
		`,
	],
})
export class PlusMinusTileComponent {
	deposit = input.required<Partial<ViewProduct>>();
	cart = inject(OrderStoreService);

	addToCart(factor: number) {
		this.cart.addItem({
			id: this.deposit().id ?? '',
			name: 'Pfand',
			quantity: factor,
			price: this.deposit().price ?? 0,
		});
	}
}
