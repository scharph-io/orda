import { Component, inject, input } from '@angular/core';
import { CartStore } from '../cart/cart.store';
import { v4 as uuidv4 } from 'uuid';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'orda-plus-minus',
  standalone: true,
  imports: [TranslocoModule],
  template: `
    <div class="plus" (click)="addToCart(1)">{{ key() | transloco }} +</div>
    <div class="minus" (click)="addToCart(-1)">{{ key() | transloco }} -</div>
  `,
  styles: [
    `
      :host {
        display: grid;
        gap: 0.25em;
        grid-template:
          'plus' 1fr
          'minus' 1fr/1fr;
        width: 100%;
        height: 100%;
      }

      .plus {
        display: flex;
        justify-content: center;
        justify-self: center;
        align-self: center;
        grid-area: plus;
      }

      .minus {
        display: flex;
        justify-self: center;
        align-self: center;
        grid-area: minus;
      }
    `,
  ],
})
export class PlusMinusComponent {
  key = input.required<string>();
  value = input.required<number>();

  cart = inject(CartStore);
  uuid = uuidv4();

  constructor(private translocoService: TranslocoService) {}

  addToCart(factor: number) {
    this.cart.addItem({
      uuid: this.key(),
      name: this.translocoService.translate(this.key()),
      quantity: factor,
      price: this.value(),
    });
  }
}
