import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'orda-cart-header',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="container">Total: {{ total() | currency:'EUR' }}</div>
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
  `
})
export class CartHeaderComponent {
  total = input.required<number>();
}
