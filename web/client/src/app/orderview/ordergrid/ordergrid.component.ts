import { NgStyle } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { CartStore } from '../cart/cart.store';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';
import { PlusMinusTileComponent } from './tiles/plus-minus-tile.component';
import { ProductTileComponent } from './tiles/product-tile.component';
// import { Category } from '../../shared/model/category';
import { MatRippleModule } from '@angular/material/core';
import { ViewProduct } from '../../shared/model/view';

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
    MatRippleModule,
    NgStyle,
    PlusMinusTileComponent,
    ProductTileComponent,
    OrdaCurrencyPipe,
  ],
  template: `
    <mat-grid-list [cols]="gridCols()" rowHeight="1:1" gutterSize="0.5em">
      <!-- @if (category().withDeposit) {
        <mat-grid-tile [colspan]="2"
          ><orda-plus-minus-tile
            [key]="'deposit'"
            [value]="category().deposit ?? 100"
        /></mat-grid-tile>
      }
      @for (product of category().products; track product) {
        @if (product.active) {
          <mat-grid-tile
            matRipple
            [matRippleCentered]="false"
            [matRippleDisabled]="false"
            [matRippleUnbounded]="false"
            (click)="addProduct(product)"
            [style.background-color]="product.color ?? 'none'"
          >
            <orda-product-tile [product]="product" />
          </mat-grid-tile>
        }
      } -->
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
  // category = input.required<Category>();

  cart = inject(CartStore);

  destroyed$ = new Subject<void>();

  gridCols = input.required<number>();

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addProduct(product: ViewProduct) {
    this.cart.addItem({
      uuid: product.id ?? '',
      name: product.name,
      price: product.price,
      quantity: 1,
      desc: product.desc,
    });
  }
}
