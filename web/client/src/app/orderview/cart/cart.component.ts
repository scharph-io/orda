import { AsyncPipe, CurrencyPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart.store';
import { CartStore } from './cart.store';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CartSubtotalComponent } from './cart-subtotal/cart-subtotal.component';
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
    AsyncPipe,
    CurrencyPipe,
    CartItemComponent,
    CartSubtotalComponent,
    CartActionsComponent,
    TranslocoModule,
  ],
  template: `
    <div class="cart">
      @for (item of items$ | async; track $index) {
        <orda-cart-item [item]="item"></orda-cart-item>
      }
      @if ((items$ | async) === null || (items$ | async)?.length === 0) {
        <span class="cartEmpty">{{ 'cart.empty' | transloco }}</span>
      }
    </div>

    <orda-cart-actions class="actions" [items]="(items$ | async) ?? []" />
    <orda-cart-subtotal
      class="subtotal"
      [subtotal]="(subtotal$ | async) ?? 0"
    />
  `,
  styles: [
    `
      // :host {
      //   display: grid;
      //   gap: 0px 0px;
      //   grid-auto-flow: row;
      //   grid-template:
      //     'subtotal' 4rem
      //     'cart' auto / 1fr;
      // }

      :host {
        padding: 1em;
        display: grid;
        gap: 0.5em;
        grid-auto-flow: row;
        justify-content: center;
        align-content: stretch;
        align-items: stretch;
        grid-template:
          'cart' 1fr
          'subtotal' min-content
          'actions' min-content/ 1fr;
      }

      .cart {
        grid-area: cart;
        height: calc(100vh - 13em);
        overflow-y: auto;
      }

      .actions {
        justify-self: center;
        align-self: start;
        grid-area: actions;
        display: flex;
        justify-content: center;
        align-items: center;
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
        height: 3em;
      }

      .cartEmpty {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class CartComponent {
  constructor(private cart: CartStore) {}

  get items$(): Observable<CartItem[]> {
    return this.cart.items$;
  }

  get subtotal$(): Observable<number> {
    return this.cart.subtotal$;
  }
}
