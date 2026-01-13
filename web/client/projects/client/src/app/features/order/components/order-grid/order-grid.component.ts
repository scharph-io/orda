import { Component, inject, input } from '@angular/core';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { ViewProduct } from '@orda.core/models/view';
import { ProductTileComponent } from '@orda.features/order/components/product-tile/product-tile.component';
import { PlusMinusTileComponent } from '@orda.features/order/components/plus-minus-tile/plus-minus-tile.component';
import { OrdaColorService } from '@orda.shared/utils/color';

@Component({
  selector: 'orda-order-grid',
  imports: [
    ScrollingModule,
    LayoutModule,
    MatRippleModule,
    ProductTileComponent,
    PlusMinusTileComponent,
  ],
  template: `
    <div
      class="mx-2 grid gap-2"
      [style.gridTemplateColumns]="'repeat(' + gridCols() + ', minmax(0, 1fr))'"
    >
      @if (deposit(); as deposit) {
        <div
          class="col-span-2 cursor-pointer rounded-lg border border-[#e3d5ca] bg-[#edede9]"
          matRipple
          [matRippleCentered]="false"
          [matRippleDisabled]="false"
          [matRippleUnbounded]="false"
        >
          <orda-plus-minus-tile [deposit]="deposit" />
        </div>
      }

      @for (vp of products(); track vp.id) {
        @let color = vp.color ?? '';
        <div
          class="cursor-pointer rounded-lg border border-[#e3d5ca] bg-[#edede9]"
          [style.backgroundColor]="
            color.startsWith('#') ? colorService.hexToHSLString(color, 0.33) : color
          "
          matRipple
          [matRippleCentered]="false"
          [matRippleDisabled]="false"
          [matRippleUnbounded]="false"
          (click)="addProduct(vp)"
        >
          <orda-product-tile [product]="vp" />
        </div>
      }
    </div>
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
