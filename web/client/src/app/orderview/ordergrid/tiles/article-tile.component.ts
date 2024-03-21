import { Component, input } from '@angular/core';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';
import { Article } from '../../../shared/model/article';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'orda-article-tile',
  standalone: true,
  imports: [OrdaCurrencyPipe, MatDividerModule],
  template: `
    <div class="price">{{ article().price | ordaCurrency }}</div>
    <div class="divider"><mat-divider></mat-divider></div>
    <div class="desc">{{ article().desc }}</div>
    <div class="name">{{ article().name }}</div>
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
  ],
})
export class ArticleTileComponent {
  article = input.required<Article>();
}
