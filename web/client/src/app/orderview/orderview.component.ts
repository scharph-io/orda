import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from './ordergrid/ordergrid.component';
import { ArticleGroup, createFakeArticles } from './article';
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

  getArticleGroups(): ArticleGroup[] {
    return [
      {
        id: 1,
        name: 'Beverages',
        articles: createFakeArticles(30, 6.5),
      },
      {
        id: 2,
        name: 'Food',
        articles: createFakeArticles(10, 15),
      },
      {
        id: 3,
        name: 'Desserts',
        articles: createFakeArticles(5, 2.5),
      },
      {
        id: 3,
        name: 'Cigarettes',
        articles: createFakeArticles(3, 7),
      },
    ];
  }
}
