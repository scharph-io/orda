import { Component, inject, input } from '@angular/core';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { ViewProduct } from '@orda.core/models/view';
import { ProductTileComponent } from '@orda.features/order/components/product-tile/product-tile.component';
import { DepositTileComponent } from '@orda.features/order/components/plus-minus-tile/plus-minus-tile.component';
import { OrdaColorService } from '@orda.shared/utils/color';

@Component({
  selector: 'orda-order-grid',
  imports: [
    ScrollingModule,
    LayoutModule,
    MatRippleModule,
    ProductTileComponent,
    DepositTileComponent,
  ],
  template: `
    <div class="mx-2 grid gap-2 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]">
      @if (deposit(); as deposit) {
        <div
          class="col-span-2 cursor-pointer rounded-lg border border-[#e3d5ca] bg-[#edede9]"
          matRipple
        >
          <orda-deposit-tile [deposit]="deposit" />
        </div>
      }
      @for (vp of products(); track vp.id) {
        @let color = vp.color ?? '';

        <div
          class="aspect-square cursor-pointer rounded-lg border border-[#e3d5ca] bg-[#edede9] flex flex-col justify-center items-center overflow-hidden relative"
          [style.backgroundColor]="
            color.startsWith('#') ? colorService.hexToHSLString(color, 0.33) : color
          "
          matRipple
          (click)="addProduct(vp)"
          (keydown)="addProduct(vp)"
          tabindex="0"
        >
          <orda-product-tile class="w-full h-full" [product]="vp" />
        </div>
      }
    </div>
  `,
})
export class OrderGridComponent {
  colorService = inject(OrdaColorService);
  products = input.required<Partial<ViewProduct>[]>();
  deposit = input<Partial<ViewProduct>>();
  // gridCols = input<number>(2);

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
