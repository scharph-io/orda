import { Component, input } from '@angular/core';
import { Article } from '../article';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';

@Component({
  selector: 'orda-article-tile',
  standalone: true,
  imports: [OrdaCurrencyPipe],
  template: `
    <div class="name">{{ article().name }}</div>
    <div class="desc">{{ article().desc }}</div>
    <div class="price">{{ article().price | ordaCurrency }}</div>
  `,
  styles: [
    `
      :host {
        display: grid;
        gap: 0.1em;
        grid-auto-flow: row;
        grid-template:
          'name' auto
          'desc' auto
          'price' 0.75rem / 1fr;
        height: 90%;
        margin: 0.25rem;
      }

      .name {
        justify-self: start;
        align-self: end;
        grid-area: name;
      }

      .desc {
        justify-self: start;
        align-self: center;
        grid-area: desc;
        font-size: 0.7rem;
      }

      .price {
        justify-self: end;
        align-self: end;
        grid-area: price;
        font-size: 0.8rem;
      }
    `,
  ],
})
export class ArticleTileComponent {
  article = input.required<Article>();
}
