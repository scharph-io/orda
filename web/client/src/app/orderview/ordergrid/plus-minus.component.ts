import { Component, inject, input } from '@angular/core';
import { CartStore } from '../cart/cart.store';
import { v4 as uuidv4 } from 'uuid';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'orda-plus-minus',
  standalone: true,
  imports: [TranslocoModule, MatIconModule],
  template: `
    <div class="item" (click)="addToCart(1)">
      {{ key() | transloco }} <mat-icon>add</mat-icon>
    </div>
    <div class="item" (click)="addToCart(-1)">
      {{ key() | transloco }} <mat-icon>remove</mat-icon>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        gap: 0.5rem;
      }

      .item {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
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
