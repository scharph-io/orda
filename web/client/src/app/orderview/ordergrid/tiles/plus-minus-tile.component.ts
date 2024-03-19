import { Component, inject, input } from '@angular/core';
import { CartStore } from '../../cart/cart.store';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

const DEFAULT_DEPOSIT = 100;

@Component({
  selector: 'orda-plus-minus-tile',
  standalone: true,
  imports: [TranslocoModule, MatIconModule],
  template: `
    <div class="item add" (click)="addToCart(1)" [title]="value()">
      {{ key() | transloco }} <mat-icon>add</mat-icon>
    </div>
    <div class="item remove" (click)="addToCart(-1)">
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
        font-size: 0.8rem;
      }

      .add {
        background-color: #4caf50;
        color: white;
      }

      .remove {
        background-color: #f44336;
        color: white;
      }
    `,
  ],
})
export class PlusMinusTileComponent {
  key = input.required<string>();
  value = input.required<number>();

  cart = inject(CartStore);
  transloco = inject(TranslocoService);

  addToCart(factor: number) {
    this.cart.addItem({
      uuid: factor > 0 ? `${this.key()}_add` : `${this.key()}_remove`,
      name: this.transloco.translate(this.key()),
      quantity: factor,
      price: this.value() === 0 ? DEFAULT_DEPOSIT : this.value(),
    });
  }
}
