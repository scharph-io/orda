import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from './ordergrid/ordergrid.component';
import { ArticleGroup } from './article';
import { CartComponent } from './cart/cart.component';
import { CartStore } from './cart/cart.store';

/**
 * @title Tab group with aligned labels
 */
@Component({
  selector: 'orda-orderview',
  templateUrl: 'orderview.component.html',
  styleUrls: ['orderview.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTabsModule, CommonModule, OrderGridComponent, CartComponent],
  providers: [CartStore],
})
export class OrderViewComponent {

  articleGroups = this.getArticleGroups();

  getArticleGroups(): ArticleGroup[]{
    return [
      {
        id: 1,
        name: 'Beverages',
        articles: [
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
        ],
      },
      {
        id: 2,
        name: 'Food',
        articles: [
          {
            name: 'Pizza',
            price: 5.0,
          },
          {
            name: 'Pasta',
            price: 3.0,
          },
          {
            name: 'Burger',
            price: 4.0,
          },
          {
            name: 'Fries',
            price: 2.5,
          },
        ],
      },
      {
        id: 3,
        name: 'Desserts',
        articles: [
          {
            name: 'Ice Cream',
            price: 2.5,
          },
          {
            name: 'Cake',
            price: 3.5,
          },
        ],
      },
      {
        id: 3,
        name: 'Cigarettes',
        articles: [
          {name: 'Marlboro', price: 5.0},{name:"ABC", price: 6.5}
        ],
      },
    ];
  }
}
