import { Component, input, OnInit, signal } from '@angular/core';
import { View } from '@orda.core/models/view';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderGridComponent } from '@orda.features/order/components/order-grid/order-grid.component';
import { CartComponent } from '@orda.features/order/components/cart/cart.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'orda-order-desktop',
	imports: [MatTabsModule, OrderGridComponent, CartComponent],
	template: `
    <div [class]="viewClass">
		<mat-tab-group
			class="products"
			mat-align-tabs="center"
			animationDuration="0ms"
			dynamicHeight="false"
		>
			@for (v of views(); track v.id) {
				@if (v.products && v.products.length > 0) {
					<mat-tab [label]="v.name ?? ''">
						<orda-order-grid [view]="v" [style.margin.em]="0.5" [gridCols]="gridCols" />
					</mat-tab>
				}
			}
		</mat-tab-group>
		<orda-cart class="cart" [style.flex-basis]="cartSize" />
	</div>`,
	styles: `
		.desktop-container {
			display: flex;
			justify-content: space-between;
			gap: 0.25rem;
      height: calc(100vh - 80px);
		}

    .desktop-container-vert {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 0.25rem;
      height: calc(100vh - 80px);
    }

		.products {
			flex-grow: 1;
			flex-basis: fit-content;
		}

		.cart {
			background-color: lightgray;
      /*width: 17rem;*/
		}
	`,
})
export class OrderDesktopComponent implements OnInit {
	views = input.required<Partial<View>[]>();

  cartSize?: string;
  viewClass = 'desktop-container';

  isMobilePortrait = signal<boolean>(false);
  gridCols = 3;

  destroyed$ = new Subject<void>();


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
          this.viewClass = 'desktop-container';
          this.cartSize = '10em';
          this.gridCols = 3;
        } else if (breakpoints[Breakpoints.Medium]) {
          console.log('screens matches Medium');
          this.viewClass = 'desktop-container';
          this.cartSize = '15em';
          this.gridCols = 6;
        } else if (breakpoints[Breakpoints.Large]) {
          console.log('screens matches Large');
          this.viewClass = 'desktop-container';
          this.cartSize = '17.5em';
          this.gridCols = 8;
        } else if (breakpoints[Breakpoints.XLarge]) {
          console.log('screens matches XLarge');
          this.viewClass = 'desktop-container';
          this.cartSize = '20em';
          this.gridCols = 10;
        } else if (breakpoints[Breakpoints.HandsetPortrait]) {
          console.log('screens matches HandsetPortrait');
          this.viewClass = 'desktop-container-vert';
          this.isMobilePortrait.set(true);
          this.cartSize = '2em';
          this.gridCols = 4;
        }
      });
  }
}
