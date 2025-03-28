import { Component, inject, input } from '@angular/core';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { View, ViewProduct } from '@orda.core/models/view';
import { ProductTileComponent } from '@orda.features/order/components/product-tile/product-tile.component';
import { PlusMinusTileComponent } from '@orda.features/order/components/plus-minus-tile/plus-minus-tile.component';

@Component({
	selector: 'orda-order-grid',
	imports: [
		MatGridListModule,
		ScrollingModule,
		LayoutModule,
		MatRippleModule,
		ProductTileComponent,
		PlusMinusTileComponent,
	],
	template: `
		<mat-grid-list [cols]="gridCols()" rowHeight="1:1" gutterSize="0.5em">
			<!--						@if (view().deposit && (view().deposit ?? 0 > 0)) {-->
			<mat-grid-tile [colspan]="2">
				<orda-plus-minus-tile [key]="'deposit'" [value]="view().deposit ?? 100" />
			</mat-grid-tile>
			<!--						}-->

			@for (vp of view().products; track vp.id) {
				<mat-grid-tile
					matRipple
					[matRippleCentered]="false"
					[matRippleDisabled]="false"
					[matRippleUnbounded]="false"
					(click)="addProduct(vp)"
				>
					<orda-product-tile [product]="vp" />
				</mat-grid-tile>
			}
		</mat-grid-list>
	`,
	styles: `
		mat-grid-tile {
			cursor: pointer;
			border-radius: 0.25em;
			background-color: lightgrey;
		}
	`,
})
export class OrderGridComponent {
	view = input.required<Partial<View>>();
	gridCols = input<number>(6);

	cart = inject(OrderStoreService);

	addProduct(p: ViewProduct) {
		this.cart.addItem({
			id: p.id ?? '',
			name: p.name,
			price: p.price,
			quantity: 1,
			desc: p.desc,
		});
	}
}
