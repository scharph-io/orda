import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  NgStyle,
} from '@angular/common';
import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Article } from '../../shared/model/article';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
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
    <mat-grid-list [cols]="gridCols" rowHeight="1:1">
      @if (category().withDeposit) {
        <mat-grid-tile [colspan]="2"
          ><orda-plus-minus-tile [key]="'cupdeposit'" [value]="100"
        /></mat-grid-tile>
      }
      @for (article of category().articles; track article) {
        @if (article.active) {
          <mat-grid-tile (click)="addArticle(article)">
            <!-- <orda-article-tile [article]="article"></orda-article-tile>
           -->
            {{ article.name }}
            {{ article.desc }}
            {{ article.price | ordaCurrency }}
          </mat-grid-tile>
        }
      }
    </mat-grid-list>
  `,
  styles: [``],
})
export class OrderGridComponent {
  category = input.required<Category>();

  destroyed$ = new Subject<void>();

  protected gridCols?: number;

  constructor(
    breakpointObserver: BreakpointObserver,
    private cart: CartStore,
  ) {
    this.gridCols = 6;
    breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.XLarge])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        // console.log(JSON.stringify(result.breakpoints));
        if (result.breakpoints[Breakpoints.Small]) {
          this.gridCols = 4;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.gridCols = 6;
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          this.gridCols = 10;
        }
      });
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
