import { Component, input } from '@angular/core';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

@Component({
  selector: 'orda-cart-subtotal',
  imports: [OrdaCurrencyPipe, OrdaCurrencyPipe],
  template: `
    <!--		<span>{{ 'cart.subtotal' }}:</span>-->
    <span>{{ 'Zwischensumme' }}:</span>
    <span class="subtotal tabular-nums"> {{ subtotal() | currency: 'EUR' }}</span>
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
      font-size: 1.2em;
      font-weight: bold;
    }
  `,
})
export class CartSubtotalComponent {
  subtotal = input.required<number>();
}
