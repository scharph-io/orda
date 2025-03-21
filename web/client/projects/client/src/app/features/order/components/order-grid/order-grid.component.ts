import { Component, inject, input } from '@angular/core';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { View, ViewProduct } from '@orda.core/models/view';
import { ProductTileComponent } from '@orda.features/order/components/product-tile/product-tile.component';

@Component({
	selector: 'orda-order-grid',
	imports: [
		MatGridListModule,
		ScrollingModule,
		LayoutModule,
		MatRippleModule,
		ProductTileComponent,
	],
	template: `
		Deposit{{ view().deposit }}

		<mat-grid-list [cols]="gridCols()" rowHeight="1:1" gutterSize="0.5em">
			<!--			@if (view().deposit && (view().deposit ?? 0 > 0)) {-->
			<!--				<mat-grid-tile [colspan]="2">-->
			<!--					Hello-->
			<!--					&lt;!&ndash;					<orda-plus-minus-tile [key]="'deposit'" [value]="view().deposit ?? 100" />&ndash;&gt;-->
			<!--				</mat-grid-tile>-->
			<!--			}-->

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
	styles: ``,
})
export class OrderGridComponent {
	view = input.required<Partial<View>>();
	gridCols = input<number>(7);

	cart = inject(OrderStoreService);

	addProduct(p: ViewProduct) {
		console.log(p);
		this.cart.addItem({
			id: p.id ?? '',
			name: p.name,
			price: p.price,
			quantity: 1,
			desc: p.desc,
		});
	}
}
