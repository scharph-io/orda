import {
  NgStyle,
} from '@angular/common';
import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Article } from '../../shared/model/article';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  LayoutModule,
} from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { CartStore } from '../cart/cart.store';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';
import { PlusMinusTileComponent } from './tiles/plus-minus-tile.component';
import { ArticleTileComponent } from './tiles/article-tile.component';
import { Category } from '../../shared/model/category';

/**
 * @title Tab group with aligned labels
 */
@Component({
  selector: 'orda-ordergrid',
  standalone: true,
  imports: [
    MatGridListModule,
    ScrollingModule,
    LayoutModule,
    NgStyle,
    PlusMinusTileComponent,
    ArticleTileComponent,
    OrdaCurrencyPipe,
  ],
  template: `
    <mat-grid-list [cols]="gridCols()" rowHeight="1:1" gutterSize="0.5em">
      @if (category().withDeposit) {
        <mat-grid-tile [colspan]="2"
          ><orda-plus-minus-tile
            [key]="'deposit'"
            [value]="category().deposit ?? 100"
        /></mat-grid-tile>
      }
      @for (article of category().articles; track article) {
        @if (article.active) {
          <mat-grid-tile
            (click)="addArticle(article)"
            [style.background-color]="article.color ?? 'none'"
          >
            <orda-article-tile [article]="article" />
          </mat-grid-tile>
        }
      }
    </mat-grid-list>
  `,
  styles: [
    `
      mat-grid-tile {
        cursor: pointer;
        border-radius: 0.25em;
        background-color: lightgrey;
      }
    `,
  ],
})
export class OrderGridComponent {
  category = input.required<Category>();

  destroyed$ = new Subject<void>();

  gridCols = input.required<number>();

  constructor(
    private cart: CartStore,
  ) {

  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addArticle(article: Article) {
    this.cart.addItem({
      uuid: article.id ?? '',
      name: article.name,
      price: article.price,
      quantity: 1,
      desc: article.desc,
    });
  }
}
