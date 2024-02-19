import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'orda-cart-header',
  standalone: true,
  imports: [OrdaCurrencyPipe, TranslocoModule],
  template: `
    <div class="container">
      {{ 'cart.subtotal' | transloco }}:
      <span>{{ total() | ordaCurrency: 'EUR' }}</span>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      gap: 1em;
      justify-content: center;
      align-items: center;
      height: 2em;
    }

    span {
      font-size: 1.5em;
      font-weight: bold;
    }
  `,
})
export class CartHeaderComponent {
  total = input.required<number>();
}
