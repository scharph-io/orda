import { Component, input } from '@angular/core';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';
import { Product } from '../../../shared/model/product';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'orda-product-tile',
    imports: [OrdaCurrencyPipe, MatDividerModule],
    template: `
    <div class="price">{{ product().price | ordaCurrency }}</div>
    <div class="divider"><mat-divider></mat-divider></div>
    <div class="desc">{{ product().desc }}</div>
    <div class="name">{{ product().name }}</div>
  `,
    styles: [
        `
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 5% 20%;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template-areas:
          'name'
          'desc'
          'divider'
          'price';
      }

      .price {
        grid-area: price;
        text-align: center;
      }

      .divider {
        grid-area: divider;
      }

      .desc {
        grid-area: desc;
        font-size: 0.8em;
        text-align: center;
      }

      .name {
        grid-area: name;
        text-align: center;
      }
    `,
    ]
})
export class ProductTileComponent {
  product = input.required<Product>();
}
