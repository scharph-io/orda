import { AsyncPipe, CurrencyPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart.store';
import { CartStore } from './cart.store';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CartHeaderComponent } from './cart-header/cart-header.component';
import { CartActionsComponent } from './cart-actions/cart-actions.component';
import { TranslocoModule } from '@ngneat/transloco';

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
    TranslocoModule,
  ],
  template: `
    <div class="title">
      <h1>{{ 'cart.title' | transloco }}</h1>
    </div>
    <div class="subtotal">
      <orda-cart-header [total]="(total$ | async) ?? 0"></orda-cart-header>
    </div>
    <div class="cart">
      <orda-cart-actions [items]="(items$ | async) ?? []"></orda-cart-actions>

      @for (item of items$ | async; track $index) {
        <orda-cart-item [item]="item"></orda-cart-item>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template:
          'title' 4rem
          'subtotal' 4rem
          'cart' auto / 1fr;
      }

      .title {
        justify-self: center;
        align-self: center;
        grid-area: title;
      }

      .subtotal {
        justify-self: center;
        align-self: center;
        grid-area: subtotal;
      }

      .cart {
        grid-area: cart;
        margin: 0 1em;
        display: flex;
        flex-direction: column;
        gap: 1em;
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
