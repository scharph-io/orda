import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { Router, RouterModule } from '@angular/router';
import { ViewBreakpointService } from '@orda.shared/services/view-breakpoint.service';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';

@Component({
  selector: 'orda-order',
  imports: [MatGridListModule, RouterModule, NavSubHeaderComponent],
  template: `
    <orda-nav-sub-header title="Bestellseiten" [showBackButton]="true" />
    <main>
      <div class="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (v of viewService.views.value(); track v.id) {
            @let id = v.id ?? '';
            <li
              (click)="navigateTo(['order', 'view', id])"
              (keydown)="navigateTo(['order', 'view', id])"
              tabindex="0"
            >
              <a
                class="flex flex-col items-center justify-center rounded-xl border border-gray-200 px-4 py-6 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              >
                <span class="text-2xl font-bold">{{ v.name }}</span>
                <span class="text">{{ v.products_count }} Produkte</span>
              </a>
            </li>
          } @empty {
            <p>No views available</p>
          }
        </ul>
      </div>
    </main>
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
  private readonly router = inject(Router);

  constructor() {
    this.viewService.views.reload();
  }

  navigateTo(path: string[]) {
    this.router.navigate(path).catch(console.error);
  }
}
