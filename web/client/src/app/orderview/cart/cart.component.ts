import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CartItem, CartService } from './cart.service';

/**
 * @title Tab group with aligned labels
 */
@Component({
  selector: 'orda-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [CartService],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1>Cart</h1>
          {{ total$ | async | currency : 'EUR' }}
          {{ articles$ | async | json }}
        </div>
      </div>
    </div>
  `,
})
export class CartComponent {
  constructor(private cart: CartService) {}

  get total$(): Observable<number> {
    return this.cart.total$;
  }

    get articles$(): Observable<CartItem[]> {
        return this.cart.articles$;
    }
}
