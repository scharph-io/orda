import { Component, inject, input } from '@angular/core';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ViewProduct } from '@orda.core/models/view';
import { ProductTileComponent } from '@orda.features/order/components/product-tile/product-tile.component';
import { PlusMinusTileComponent } from '@orda.features/order/components/plus-minus-tile/plus-minus-tile.component';
import { OrdaColorService } from '@orda.shared/utils/color';

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
			@if (deposit(); as deposit) {
				<mat-grid-tile
					matRipple
					[matRippleCentered]="false"
					[matRippleDisabled]="false"
					[matRippleUnbounded]="false"
					[colspan]="2"
				>
					<orda-plus-minus-tile [deposit]="deposit" />
				</mat-grid-tile>
			}

			@for (vp of products(); track vp.id) {
				@let color = vp.color ?? '';
				<mat-grid-tile
					[style]="{
						'background-color': color.startsWith('#')
							? colorService.hextoHSLString(color, 0.33)
							: '',
					}"
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
	colorService = inject(OrdaColorService);
	products = input.required<Partial<ViewProduct>[]>();
	deposit = input<Partial<ViewProduct>>();
	gridCols = input<number>(2);

	cart = inject(OrderStoreService);

	addProduct(p: Partial<ViewProduct>): void {
		this.cart.addItem({
			id: p.id ?? '',
			name: p.name ?? '',
			price: p.price ?? 0,
			quantity: 1,
			desc: p.desc,
		});
	}
}
