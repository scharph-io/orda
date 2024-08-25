import { Component, Inject, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { TranslocoModule } from '@jsverse/transloco';
import { MessageService } from '../../../shared/services/message.service';
import { Product } from '../../../shared/model/product';
import { AssortmentService } from '../../../shared/services/assortment.service';

@Component({
  selector: 'orda-create-product-dialog',
  template: `
    <h2 mat-dialog-title>
      {{ 'product.append' | transloco }}
    </h2>
    <mat-dialog-content> </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close>
        {{ 'dialog.cancel' | transloco }}
      </button>
      <button mat-button color="primary" (click)="save()">
        {{ 'dialog.save' | transloco }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    TranslocoModule,
  ],
})
export class ProductAppendDialogComponent {
  save() {
    console.log('Not implemented');
  }
}
