import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'orda-cart-subtotal',
  standalone: true,
  imports: [OrdaCurrencyPipe, TranslocoModule],
  template: `
    <span>{{ 'cart.subtotal' | transloco }}:</span>
    <span class="subtotal">{{ subtotal() | ordaCurrency: 'EUR' }}</span>
  `,
  styles: `
    :host {
      display: flex;
      gap: 1em;
      justify-content: center;
      align-items: center;
      height: auto;
    }

    .subtotal {
      font-size: 1.5em;
      font-weight: bold;
    }
  `,
})
export class CartSubtotalComponent {
  subtotal = input.required<number>();
}
