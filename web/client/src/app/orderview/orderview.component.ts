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
// import { CategoryService } from '../shared/services/category.service';
// import { Category } from '../shared/model/category';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { CartSubtotalComponent } from './cart/cart-subtotal/cart-subtotal.component';
import { CartFooterComponent } from './cart/mobile/cart-footer.component';
import { AuthService } from '../auth/auth.service';

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
    CartFooterComponent,
  ],
  providers: [CartStore, CheckoutService],
})
export class OrderViewComponent implements OnInit {
  // categoryService = inject(CategoryService);

  // selectedCategory = signal<Category | undefined>(undefined);

  // categories = signal<Category[]>([]);

  destroyed$ = new Subject<void>();
  cartSize?: string;

  isMobilePortrait = signal<boolean>(false);
  gridCols = 3;

  authService = inject(AuthService);

  constructor(private responsive: BreakpointObserver) {}

  ngOnInit() {
    this.cartSize = '30em';
    this.responsive
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        const breakpoints = result.breakpoints;
        this.isMobilePortrait.set(false);
        if (breakpoints[Breakpoints.Small]) {
          console.log('screens matches Small');
          this.cartSize = '10em';
          this.gridCols = 3;
        } else if (breakpoints[Breakpoints.Medium]) {
          console.log('screens matches Medium');
          this.cartSize = '15em';
          this.gridCols = 6;
        } else if (breakpoints[Breakpoints.Large]) {
          console.log('screens matches Large');
          this.cartSize = '17.5em';
          this.gridCols = 8;
        } else if (breakpoints[Breakpoints.XLarge]) {
          console.log('screens matches XLarge');
          this.cartSize = '20em';
          this.gridCols = 10;
        } else if (breakpoints[Breakpoints.HandsetPortrait]) {
          console.log('screens matches HandsetPortrait');
          this.isMobilePortrait.set(true);
          this.gridCols = 3;
        }
      });

    // this.categoryService
    //   .getCategories$(this.authService.username)
    //   .subscribe((categories) => {
    //     this.categories.set(categories);
    //     this.selectedCategory.set(categories[0]);
    //   });
  }
}
