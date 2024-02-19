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
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';
import { PlusMinusComponent } from './plus-minus.component';

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
    PlusMinusComponent,
  ],
  template: `
    <div class="container">
      <mat-grid-list [cols]="gridCols" rowHeight="1:1" gutterSize="0.5rem">
        @if (group().id === 1) {
          <mat-grid-tile [colspan]="2"
            ><orda-plus-minus [key]="'cupdeposit'" [value]="100"
          /></mat-grid-tile>
        }
        @for (article of group().articles; track article) {
          @if (article.active) {
            <mat-grid-tile (click)="addArticle(article)"
              >{{ article.name }}({{ article.desc }}) <br />
              {{ article.price | ordaCurrency }}</mat-grid-tile
            >
          }
        }
      </mat-grid-list>
    </div>
  `,
  styles: [
    `
      mat-grid-list {
        overflow: auto;
      }

      mat-grid-tile {
        /* From https://css.glass */
        // background: rgba(14, 255, 0, 0.25);
        border-radius: 10px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        // border: 1px solid rgba(255, 255, 255, 0.59);
      }
      .container {
        // margin: 0.5rem;
        // height: calc(99vh - 118px);
        overflow: auto;
      }
      .container::-webkit-scrollbar {
        display: none;
      }
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
        // console.log(JSON.stringify(result.breakpoints));
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
