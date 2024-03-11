import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from './ordergrid/ordergrid.component';
import { CartComponent } from './cart/cart.component';
import { CartStore } from './cart/cart.store';
import { CheckoutService } from './services/checkout.service';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/model/category';

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
    AsyncPipe,
  ],
  providers: [CartStore, CheckoutService],
})
export class OrderViewComponent implements OnInit {
  categoryService = inject(CategoryService);

  selectedCategory = signal<Category | undefined>(undefined);

  categories = signal<Category[]>([]);

  ngOnInit() {
    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories.set(categories);
      this.selectedCategory.set(categories[0]);
    });
  }
}
