import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatDividerModule } from '@angular/material/divider';
import { CartItem, OrderStoreService } from '@orda.features/order/services/order-store.service';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

@Component({
	selector: 'orda-cart-item',
	imports: [MatButtonModule, MatIconModule, MatDividerModule, OrdaCurrencyPipe],
	template: `
		<div
			[class]="{
				container: true,
				'container-with-desc': item().desc !== undefined,
			}"
		>
			<div class="title">{{ item().name }}</div>
			@if (item().desc) {
				<div class="desc">{{ item().desc }}</div>
			}
			<div class="quantity">{{ item().quantity }}</div>
			<div class="sum">
				{{ item().price * item().quantity | currency: 'EUR' }}
			</div>
			<div class="rm">
				<mat-icon (click)="removeItem(item())" [style]="{ color: 'grey' }">delete</mat-icon>
			</div>
		</div>
		<mat-divider></mat-divider>
	`,
	styles: `
		.container {
			display: grid;
			gap: 0px 0.25em;
			grid-auto-flow: row;
			grid-template: 'title quantity sum rm' 1fr / auto 1fr 5em 2em;
			width: auto;
		}

		.container-with-desc {
			grid-template:
				'title quantity sum rm' 1fr
				'desc quantity sum rm' 1fr / auto 0.15fr 5em 2em;
		}

		.title {
			grid-area: title;
			display: flex;
			align-items: center;
		}

		.desc {
			grid-area: desc;
			font-size: 0.75rem;
			text-overflow: ellipsis;
			line-height: 1.5em;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 100%;
		}

		.quantity {
			grid-area: quantity;
			display: flex;
			justify-content: right;
			align-items: center;
		}

		.sum {
			grid-area: sum;
			display: flex;
			justify-content: right;
			align-items: center;
		}

		.rm {
			grid-area: rm;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	`,
})
export class CartItemComponent {
	item = input.required<CartItem>();

	containerClass = computed(() => {
		if (this.item().desc) {
			return 'container-with-desc';
		} else {
			return 'container';
		}
	});

	cartStore = inject(OrderStoreService);

	removeItem(item: CartItem): void {
		this.cartStore.removeItem(item);
	}
}
