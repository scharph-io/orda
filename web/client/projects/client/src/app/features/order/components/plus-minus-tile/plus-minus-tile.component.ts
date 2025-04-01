import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { ViewProduct } from '@orda.core/models/view';


@Component({
	selector: 'orda-plus-minus-tile',
	standalone: true,
	imports: [MatIconModule],
	template: `
		<div class="item add" (click)="addToCart(1)" [title]="deposit()">
<!--			{{ key() }} <mat-icon>add</mat-icon>-->
      Pfand <mat-icon>add</mat-icon>
		</div>
		<div class="item remove" (click)="addToCart(-1)">
<!--      {{ key() }} <mat-icon>remove</mat-icon>-->
       Pfand <mat-icon>remove</mat-icon>
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
				font-size: 1rem;
			}

			.add {
				background-color: #4caf50;
				color: white;
			}

			.remove {
				background-color: #f44336;
				color: white;
			}
		`,
	],
})
export class PlusMinusTileComponent {

  deposit = input.required<Partial<ViewProduct>>()
	cart = inject(OrderStoreService);

	addToCart(factor: number) {
		this.cart.addItem({
			id: this.deposit().id ?? '',
			name: "Pfand",
			quantity: factor,
			price: this.deposit().price ?? 0,
		});
	}
}
