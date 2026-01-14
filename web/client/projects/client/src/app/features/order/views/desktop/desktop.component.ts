import { Component, computed, inject, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from '@orda.features/order/components/order-grid/order-grid.component';
import { CartComponent } from '@orda.features/order/components/cart/cart.component';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { KeyValuePipe } from '@angular/common';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';

import { CartMobileComponent } from '@orda.features/order/components/cart-mobile/cart-mobile.component';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'orda-order-desktop',
  imports: [MatTabsModule, OrderGridComponent, CartComponent, KeyValuePipe, CartMobileComponent],
  template: `
    <div
      class="grid grid-cols-1 md:grid-cols-[1fr_minmax(20rem,25%)] gap-1 p-2 sm:p-3 lg:p-4 h-[calc(100vh-3rem)]"
    >
      <main class="rounded-lg h-full overflow-hidden">
        @if (!isSinglePage()) {
          <mat-tab-group class="products h-full" animationDuration="0ms">
            @let obj = data.value();
            @if (obj !== undefined) {
              @let productsMap = obj.products;
              @for (group of productsMap | keyvalue; track group.key) {
                @let products = group.value;
                @if (products.length > 0) {
                  <mat-tab [label]="groupName(group.key)">
                    <div class="h-full overflow-y-auto">
                      <orda-order-grid
                        [products]="products"
                        [deposit]="obj.deposits ? obj.deposits[group.key] : undefined"
                        [style.margin.rem]="0.5"
                      />
                    </div>
                  </mat-tab>
                }
              } @empty {
                <div>Leer</div>
              }
            }
          </mat-tab-group>
        } @else {
          <orda-order-grid
            [products]="singleProducts()"
            [deposit]="singleDeposit()"
            [style.margin.rem]="0.5"
          />
        }
      </main>
      <aside class="bg-gray-100 p-1 rounded-lg min-h-0">
        <orda-cart class="cart" [view_id]="viewid()" />
      </aside>
    </div>

    <!-- @if (!isMobilePortrait()) {
        <orda-cart class="cart" [style.flex-basis]="cartSize()" [view_id]="viewid()" />
      } @else {
        <orda-cart-mobile class="cart" [view_id]="viewid()" />
      } -->
  `,
  styles: `
    .products {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .products ::ng-deep .mat-mdc-tab-body-wrapper {
      flex-grow: 1;
      overflow: hidden;
    }
  `,
})
export class OrderDesktopComponent {
  viewid = input.required<string>();

  orderService = inject(OrderService);
  assortmentService = inject(AssortmentService);

  data = rxResource({
    params: () => this.viewid(),
    stream: ({ params }) => this.orderService.getViewProducts(params),
  });

  isSinglePage = computed(() => Object.keys(this.data.value()?.products ?? {}).length <= 1);
  singleProducts = computed(() => {
    const products = this.data.value()?.products;
    return products ? Object.values(products)[0] : [];
  });

  singleDeposit = computed(() => {
    const deposits = this.data.value()?.deposits;
    return deposits ? Object.values(deposits)[0] : undefined;
  });

  // gridCols = inject(GridColSizeService).size;
  // cartSize = signal<string>('18.5em');
  // viewClass = signal<string>('desktop-dashboard');
  // isMobilePortrait = signal<boolean>(false);

  // viewBreakpoints = toSignal(inject(ViewBreakpointService).getBreakpoint());

  // constructor() {
  //   effect(() => {
  //     const breakpoint = this.viewBreakpoints();
  //     switch (breakpoint) {
  //       case 'XSmall':
  //       case 'Small':
  //         this.viewClass.set('portrait');
  //         this.isMobilePortrait.set(true);
  //         break;
  //       case 'Medium':
  //         this.viewClass.set('');
  //         this.isMobilePortrait.set(false);
  //         this.cartSize.set('17.5em');
  //         break;
  //       case 'Large':
  //         this.viewClass.set('');
  //         this.isMobilePortrait.set(false);
  //         this.cartSize.set('22em');
  //         break;
  //     }
  //   });
  // }

  groupName(id: string) {
    return (
      this.assortmentService.groups.value()?.find((group) => group.id === id)?.name ?? 'unknown'
    );
  }
}
