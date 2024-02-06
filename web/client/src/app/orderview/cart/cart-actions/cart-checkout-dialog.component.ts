import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { CartItem } from '../cart.store';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CheckoutData, CheckoutService } from '../../services/articles.service';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';

@Component({
  selector: 'orda-checkout-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    OrdaCurrencyPipe,
    FormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
  ],
  template: `
    <h1 mat-dialog-title>Summary</h1>
    <div mat-dialog-content>
      Total: {{ checkoutData.total | ordaCurrency: 'EUR' }}
      <mat-slide-toggle [(ngModel)]="checkoutData.not_charged"
        >Special</mat-slide-toggle
      >
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="{ clear: false }">Cancel</button>
      <button
        mat-button
        color="warn"
        [mat-dialog-close]="{ clear: true }"
        cdkFocusInitial
        (click)="submit()"
      >
        <mat-icon>shopping_cart_checkout</mat-icon>
        @if (checkoutData.not_charged) {
          Als Sponsor
        } @else {
          Bar
        }
      </button>
    </div>
  `,
})
export class CheckoutDialogComponent {
  checkoutData: CheckoutData = {
    items: [],
    total: 0,
    not_charged: false,
  };

  checkout = inject(CheckoutService);

  constructor(
    public dialogRef: MatDialogRef<CheckoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CartItem[],
  ) {
    this.checkoutData.items = this.data;
    this.checkoutData.total = this.data.reduce(
      (a, b) => a + b.price * b.quantity,
      0,
    );
  }

  submit(): void {
    console.log(this.checkoutData);
    this.checkout.checkout(this.checkoutData).subscribe((res) => {
      console.log(res);
    });
  }
}
