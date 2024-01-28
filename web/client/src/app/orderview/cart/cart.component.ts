import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart.store';
import { CartStore } from './cart.store';

/**
 * @title Tab group with aligned labels
 */
@Component({
  selector: 'orda-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1>Cart</h1>
          <!-- {{ total$ | async | currency : 'EUR' }} -->
          @for (item of items$ | async; track $index) {
            <div class="row">
              <div class="col-3">
                {{ item.articleName }}
              </div>
              <div class="col-2">
                {{ item.amount}}
              </div>
              <div class="col-2">
                {{ item.price | currency : 'EUR' }}
              </div>
            </div>
          }
          <button (click)="clearCart()">Clear</button>
          {{ total$ | async | currency : 'EUR' }}
        </div>
      </div>
    </div>
  `,
})
export class CartComponent {
  constructor(private cart: CartStore) {}

    get items$(): Observable<CartItem[]> {
        return this.cart.items$;
    }

    get total$(): Observable<number> {
        return this.cart.total$;
    }

    removeItem(item: CartItem): void {
        this.cart.removeItem(item);
    }

    clearCart(): void {
        this.cart.clear();
    }
}
