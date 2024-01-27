import { CommonModule } from '@angular/common';
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
import { CartService } from '../cart/cart.service';

/**
 * @title Tab group with aligned labels
 */
@Component({
  selector: 'orda-ordergrid',
  standalone: true,
  imports: [MatGridListModule, CommonModule, ScrollingModule, LayoutModule],
  providers: [CartService],
  template: `
    <div class="container">
      <mat-grid-list [cols]="gridCols" rowHeight="1:1" gutterSize="0.5rem">
        @for (article of group?.articles; track article) {
        <mat-grid-tile (click)="addArticle(article)">{{ article.name }} <br> {{article.price | currency : 'EUR'}}</mat-grid-tile>
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

      mat-grid-tile {
        background: lightblue;
      }
    `,
  ],
})
export class OrderGridComponent {
  @Input() group?: ArticleGroup;

  destroyed = new Subject<void>();

  protected gridCols = 4;

  constructor(breakpointObserver: BreakpointObserver,private cart: CartService) {
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
          this.gridCols = 3;
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
    console.log('addArticle', article);
    this.cart.addArticle({articleName: article.name, price: article.price});
  }
}
