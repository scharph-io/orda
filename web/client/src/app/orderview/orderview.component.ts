import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from './ordergrid/ordergrid.component';
import { ArticleGroup, createFakeArticles } from './article';
import { CartComponent } from './cart/cart.component';
import { CartStore } from './cart/cart.store';
import { CheckoutService } from './services/checkout.service';
import { MatIconModule } from '@angular/material/icon';

/**
 * @title Tab group with aligned labels
 */
@Component({
  selector: 'orda-orderview',
  templateUrl: 'orderview.component.html',
  styleUrls: ['orderview.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTabsModule,
    MatIconModule,
    CommonModule,
    OrderGridComponent,
    CartComponent,
  ],
  providers: [CartStore, CheckoutService],
})
export class OrderViewComponent {
  articleGroups = this.getArticleGroups();

  getArticleGroups(): ArticleGroup[] {
    return [
      {
        id: 1,
        name: 'Beverages',
        articles: createFakeArticles('Bier', '0.5l', 30, 6.5),
      },
      {
        id: 2,
        name: 'Food',
        articles: createFakeArticles('Grillhendl', 'Pommes', 10, 15),
      },
      {
        id: 3,
        name: 'Desserts',
        articles: createFakeArticles('Kuchen', undefined, 5, 2.5),
      },
      {
        id: 3,
        name: 'Cigarettes',
        articles: createFakeArticles('Malboro', undefined, 3, 7),
      },
    ];
  }
}
