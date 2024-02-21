import { CommonModule, CurrencyPipe, NgStyle } from '@angular/common';
import { Component, Input, input } from '@angular/core';
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
import { PlusMinusTileComponent } from './tiles/plus-minus-tile.component';
import { ArticleTileComponent } from './tiles/article-tile.component';

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
  ],
  template: `
    <!-- @if (group().id === 1) {
          <mat-grid-tile [colspan]="2"
            ><orda-plus-minus-tile [key]="'cupdeposit'" [value]="100"
          /></mat-grid-tile>
        } -->
    @for (article of group().articles; track article) {
      @if (article.active) {
        <orda-article-tile (click)="addArticle(article)" [article]="article" />
      }
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: start;
      }

      // .tile {
      //   height: 5rem;
      //   width: 5rem;
      // }
    `,
  ],
})
export class OrderGridComponent {
  group = input.required<ArticleGroup>();

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
          this.gridCols = 6;
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
