import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { CartItem } from '../cart.store';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'orda-cart-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ 'cart.title' | transloco }}</h2>
    <mat-dialog-content>
      @for (item of data; track $index) {
        <orda-cart-item [item]="item"></orda-cart-item>
      }
    </mat-dialog-content>
    <mat-dialog-actions
      [style]="{ display: 'flex', 'justify-content': 'flex-end' }"
    >
      <button mat-button mat-dialog-close>
        {{ 'dialog.cancel' | transloco }}
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    CartItemComponent,
    TranslocoModule,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
})
export class CartDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CartItem[]) {}
}
