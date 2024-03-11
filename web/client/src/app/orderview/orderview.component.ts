import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from './ordergrid/ordergrid.component';
import { ArticleGroup } from '../shared/model/article';
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
  articleGroups: ArticleGroup[] = [
    // {
    //   id: 1,
    //   name: 'Beverages',
    //   articles$: inject(ArticleService).getArticles(),
    // },
  ];
  // getArticleGroups(): ArticleGroup[] {
  //   return [
  //     {
  //       id: 1,
  //       name: 'Beverages',
  //       articles: createFakeArticles(30, 6.5),
  //     },
  //     {
  //       id: 2,
  //       name: 'Food',
  //       articles: createFakeArticles(10, 15),
  //     },
  //     {
  //       id: 3,
  //       name: 'Desserts',
  //       articles: createFakeArticles(5, 2.5),
  //     },
  //     {
  //       id: 3,
  //       name: 'Cigarettes',
  //       articles: createFakeArticles(3, 7),
  //     },
  //   ];
  // }
}
