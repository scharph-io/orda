import { Component, input } from '@angular/core';
import { Article } from '../../article';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';

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
        gap: 0.25em;
        grid-auto-flow: row;
        grid-template:
          'name' 1fr
          'desc' 1fr
          'price' auto/1fr;
        margin: 0.25rem;
        width: 6em;
        height: 6em;
      }

      .name {
        justify-self: start;
        align-self: end;
        grid-area: name;
        overflow: hidden;
        white-space: nowrap;
      }

      .desc {
        justify-self: start;
        align-self: center;
        grid-area: desc;
        font-size: 0.75rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        justify-self: end;
        align-self: end;
        grid-area: price;
        font-size: 0.8rem;
      }

      // @media (min-width: 1500px) {
      //   .name {
      //     font-size: 1.5rem;
      //   }

      //   .desc {
      //     font-size: 1rem;
      //     -webkit-line-clamp: 3;
      //   }

      //   .price {
      //     font-size: 1rem;
      //   }
      // }

      // @media (max-width: 800px) {
      //   .name {
      //     font-size: 0.6rem;
      //   }

      //   .desc {
      //     font-size: 0.4rem;
      //     -webkit-line-clamp: 3;
      //   }

      //   .price {
      //     font-size: 0.5rem;
      //   }
      // }

      // @media (max-width: 600px) {
      //   .name {
      //     font-size: 1.2rem;
      //   }

      //   .desc {
      //     font-size: 0.75rem;
      //     -webkit-line-clamp: 3;
      //   }

      //   .price {
      //     font-size: 0.95rem;
      //   }
      // }
    `,
  ],
})
export class ArticleTileComponent {
  article = input.required<Article>();
}
