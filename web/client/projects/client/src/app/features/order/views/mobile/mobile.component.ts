import { Component, computed, inject, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from '@orda.features/order/components/order-grid/order-grid.component';
import { CartMobileComponent } from '@orda.features/order/components/cart-mobile/cart-mobile.component';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { KeyValuePipe } from '@angular/common';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'orda-order-mobile',
  imports: [MatTabsModule, OrderGridComponent, KeyValuePipe, CartMobileComponent],
  template: `
    <div class="flex flex-col h-[calc(100vh-3rem)] bg-white">
      <main class="flex-1 overflow-hidden relative">
        @if (!isSinglePage()) {
          <mat-tab-group
            class="products h-full"
            animationDuration="0ms"
            mat-stretch-tabs="true"
            mat-align-tabs="start"
          >
            @let obj = data.value();
            @if (obj !== undefined) {
              @let productsMap = obj.products;
              @for (group of productsMap | keyvalue; track group.key) {
                @let products = group.value;
                @if (products.length > 0) {
                  <mat-tab [label]="groupName(group.key)">
                    <div class="h-full overflow-y-auto bg-gray-50 p-1">
                      <orda-order-grid
                        [products]="products"
                        [deposit]="obj.deposits ? obj.deposits[group.key] : undefined"
                      />
                      <div class="h-4"></div>
                    </div>
                  </mat-tab>
                }
              } @empty {
                <div class="flex justify-center items-center h-full text-gray-500">Leer</div>
              }
            }
          </mat-tab-group>
        } @else {
          <div class="h-full overflow-y-auto bg-gray-50 p-1">
            <orda-order-grid [products]="singleProducts()" [deposit]="singleDeposit()" />
          </div>
        }
      </main>

      <footer class="flex-none z-10 border-t border-gray-200 bg-white">
        <orda-cart-mobile [view_id]="viewid()" />
      </footer>
    </div>
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
export class OrderMobileComponent {
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

  groupName(id: string) {
    return (
      this.assortmentService.groups.value()?.find((group) => group.id === id)?.name ?? 'unknown'
    );
  }
}
