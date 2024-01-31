import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';

@Component({
  selector: 'orda-cart-header',
  standalone: true,
  imports: [OrdaCurrencyPipe],
  template: `
    <div class="container">
      Total: {{ total() | ordaCurrency : 'EUR' }}
    </div>
  `,
  styles: `
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 2em;
      font-size: 1.5em;
      font-weight: bold;
    }
  `,
})
export class CartHeaderComponent {
  total = input.required<number>();
}
