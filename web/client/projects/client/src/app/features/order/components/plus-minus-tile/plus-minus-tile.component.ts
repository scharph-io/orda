import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderStoreService } from '@orda.features/order/services/order-store.service';
import { ViewProduct } from '@orda.core/models/view';

@Component({
  selector: 'orda-deposit-tile',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div
      class="h-full w-full flex flex-row gap-0.5 select-none text-white overflow-hidden rounded-lg min-h-3"
    >
      <div
        class="flex-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 group"
        (click)="addToCart(1)"
        (keyup)="addToCart(1)"
        [title]="deposit()"
        tabindex="0"
        role="button"
      >
        <mat-icon
          class="scale-125 mb-1 transition-transform group-hover:scale-150 group-active:scale-110"
        >
          add
        </mat-icon>
        <span class="font-bold text-lg leading-none uppercase tracking-wide">Pfand</span>
      </div>

      <div
        class="flex-1 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 group"
        (click)="addToCart(-1)"
        (keyup)="addToCart(-1)"
        tabindex="0"
        role="button"
      >
        <mat-icon
          class="scale-125 mb-1 transition-transform group-hover:scale-150 group-active:scale-110"
        >
          remove
        </mat-icon>
        <span class="font-bold text-lg leading-none uppercase tracking-wide">Pfand</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
        min-height: 6rem;
      }

      /* Optional: If mat-icon font-size overrides tailwind, force it here */
      mat-icon {
        width: auto;
        height: auto;
        font-size: 2rem; /* Adjust based on your preference */
      }
    `,
  ],
})
export class DepositTileComponent {
  deposit = input.required<Partial<ViewProduct>>();
  cart = inject(OrderStoreService);

  addToCart(factor: number) {
    this.cart.addItem({
      id: this.deposit().id ?? '',
      name: 'Pfand',
      quantity: factor,
      price: this.deposit().price ?? 0,
    });
  }
}
