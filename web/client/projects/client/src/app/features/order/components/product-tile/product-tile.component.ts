import { Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ViewProduct } from '@orda.core/models/view';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

@Component({
  selector: 'orda-product-tile',
  standalone: true,
  imports: [OrdaCurrencyPipe, MatDividerModule, OrdaCurrencyPipe],
  template: `
    <div class="h-full w-full flex flex-col justify-between p-3 select-none text-slate-800">
      <div class="flex-1 flex flex-col justify-center items-center gap-1">
        <div class="font-bold text-center leading-tight text-lg break-words w-full px-1">
          {{ product().name }}
        </div>

        @if (product().desc; as desc) {
          <div class="text-xs font-medium uppercase tracking-wide opacity-60">
            {{ desc }}
          </div>
        }
      </div>

      <div
        class="w-1/2 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent mx-auto my-2"
      ></div>

      <div class="text-2xl font-extrabold text-center tracking-tight">
        {{ product().price | currency }}
      </div>
    </div>

    
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class ProductTileComponent {
  product = input.required<Partial<ViewProduct>>();
}
