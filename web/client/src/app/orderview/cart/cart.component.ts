import { AsyncPipe, CurrencyPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart.store';
import { CartStore } from './cart.store';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CartHeaderComponent } from './cart-header/cart-header.component';
import { CartActionsComponent } from './cart-actions/cart-actions.component';

/**
 * @title Tab group with aligned labels
 */
@Component({
  selector: 'orda-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    AsyncPipe,
    CurrencyPipe,
    CartItemComponent,
    CartHeaderComponent,
    CartActionsComponent,
  ],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1>Cart</h1>
          <orda-cart-header [total]="(total$ | async) ?? 0"></orda-cart-header>
          <orda-cart-actions
            [items]="(items$ | async) ?? []"
          ></orda-cart-actions>
          <div class="cart-container">
            @for (item of items$ | async; track $index) {
              <orda-cart-item [item]="item"></orda-cart-item>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .cart-container {
        background-color: #f5f5f5;
      }
    `,
  ],
})
export class CartComponent {
  constructor(private cart: CartStore) {}

  get items$(): Observable<CartItem[]> {
    return this.cart.items$;
  }

  get total$(): Observable<number> {
    return this.cart.total$;
  }
}
