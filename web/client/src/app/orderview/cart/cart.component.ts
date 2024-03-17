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
    JsonPipe,
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

    <orda-cart-actions
      class="actions"
      [items]="(items$ | async) ?? []"
    ></orda-cart-actions>
    <orda-cart-subtotal class="subtotal" [total]="(total$ | async) ?? 0">
      <!-- <div class="cart">
      
      
    </div> -->
    </orda-cart-subtotal>
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
        grid-template-columns: 1fr;
        grid-template-rows: 1fr min-content min-content;
        gap: 0.5em;
        grid-auto-flow: row;
        justify-content: center;
        align-content: stretch;
        align-items: stretch;
        grid-template-areas:
          'cart'
          'subtotal'
          'actions';
      }

      .cart {
        grid-area: cart;
        height: calc(100vh - 13em);
        overflow-y: auto;
      }

      ::-webkit-scrollbar {
        width: 9px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background-color: rgba(155, 155, 155, 0.5);
        border-radius: 20px;
        border: transparent;
      }

      .actions {
        justify-self: center;
        align-self: start;
        grid-area: actions;
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

  get total$(): Observable<number> {
    return this.cart.total$;
  }
}
