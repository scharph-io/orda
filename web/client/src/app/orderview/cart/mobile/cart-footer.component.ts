import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CartSubtotalComponent } from '../cart-subtotal/cart-subtotal.component';
import { CartStore } from '../cart.store';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'orda-cart-footer',
  standalone: true,
  template: `
      <orda-cart-subtotal [subtotal]="(subtotal$ | async) ?? 0"></orda-cart-subtotal>
      <button mat-icon-button color="info" (click)="onOpenCart.emit($event)">
        <mat-icon>shopping_cart</mat-icon>
      </button>

  `,
  styles: [
    `
      :host{
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: lightgray;
        border-top: 1px solid black;
      }

      orda-cart-subtotal {
        width: 15em;
      }
    `
  ],
  imports: [CartSubtotalComponent, AsyncPipe, MatButtonModule, MatIconModule, TranslocoModule]
})
export class CartFooterComponent {
  cartStore = inject(CartStore);

  @Output() onOpenCart = new EventEmitter<Event>();

  get subtotal$() {
    return this.cartStore.subtotal$;
  }
}
