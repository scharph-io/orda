import { CommonModule, CurrencyPipe, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Article, ArticleGroup } from '../article';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { CartStore } from '../cart/cart.store';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';

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
    OrdaCurrencyPipe,
  ],
  template: `
    <div class="container">
      <mat-grid-list [cols]="gridCols" rowHeight="1:1" gutterSize="0.5rem">
        @for (article of group?.articles; track article) {
          <mat-grid-tile
            [style.backgroundColor]="article.color"
            (click)="addArticle(article)"
            >{{ article.name }}({{ article.desc }}) <br />
            {{ article.price | ordaCurrency }}</mat-grid-tile
          >
        }
      </mat-grid-list>
    </div>
  `,
  styles: [
    `
      mat-grid-list {
        overflow: auto;
      }
      .container {
        margin: 0.5rem;
        height: calc(99vh - 120px);
        overflow: auto;
      }
      .container::-webkit-scrollbar {
        display: none;
      }
    `,
  ],
})
export class OrderGridComponent {
  @Input() group?: ArticleGroup;

  destroyed = new Subject<void>();

  protected gridCols = 4;

  constructor(
    breakpointObserver: BreakpointObserver,
    private cart: CartStore,
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        console.log(JSON.stringify(result.breakpoints));
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.gridCols = 2;
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.gridCols = 5;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.gridCols = 7;
        } else if (result.breakpoints[Breakpoints.Large]) {
          this.gridCols = 7;
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          this.gridCols = 8;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  addArticle(article: Article) {
    this.cart.addItem({
      uuid: article.uuid,
      name: article.name,
      price: article.price,
      quantity: 1,
      desc: article.desc,
    });
  }
}
