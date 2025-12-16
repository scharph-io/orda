import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { MatRipple } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { ViewBreakpointService } from '@orda.shared/services/view-breakpoint.service';
import { MatIcon } from '@angular/material/icon';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';

@Component({
  selector: 'orda-order',
  imports: [MatGridListModule, MatRipple, RouterModule, MatIcon, NavSubHeaderComponent],
  template: `
    <orda-nav-sub-header title="Bestellseiten" [showBackButton]="true" />

    @let views = viewService.views.value() ?? [];
    @if (views.length === 0) {
      <p>No views available</p>
    } @else {
      <mat-grid-list [cols]="4" rowHeight="1:1" gutterSize="0.5rem">
        @for (v of viewService.views.value(); track v.id) {
          <mat-grid-tile mat-ripple [routerLink]="['view', v.id]">
            <div class="container">
              <div class="title">{{ v.name }}</div>
              <div class="cnt">{{ v.products_count }} Produkte</div>
            </div>
          </mat-grid-tile>
        }
      </mat-grid-list>
    }
  `,
  styles: `
    mat-grid-list {
      margin: 1rem;
    }
    h1 {
      margin-top: 5vh;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
    }

    .title {
      font-size: 1.75em;
      font-weight: 500;
    }

    .cnt {
      font-weight: 300;
      color: grey;
    }

    mat-icon {
      height: 3rem;
      width: 3rem;
      font-size: 3rem;
    }

    .tile-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .tile-text {
      margin-top: 0.25rem;
      font-size: 1.25rem;
    }
  `,
})
export class OrderComponent {
  viewService = inject(OrderService); // refactor naming
  breakpointService = inject(ViewBreakpointService);

  constructor() {
    this.viewService.views.reload();
  }
}
