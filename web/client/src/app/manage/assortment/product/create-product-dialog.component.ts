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
  template: `<form [formGroup]="productForm">
    <h2 mat-dialog-title>
      @if (isUpdate) {
        {{ 'product.edit' | transloco }}
      } @else {
        {{ 'product.add' | transloco }}
      }
    </h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>{{ 'table.name' | transloco }}</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>{{ 'table.desc' | transloco }}</mat-label>
        <input matInput formControlName="desc" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>{{ 'table.price' | transloco }}</mat-label>
        <input matInput type="number" formControlName="price" />
      </mat-form-field>

      <mat-slide-toggle class="example-margin" formControlName="active">
        {{ 'table.active' | transloco }}
      </mat-slide-toggle>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close>
        {{ 'dialog.cancel' | transloco }}
      </button>
      @if (isUpdate) {
        <button
          mat-button
          color="primary"
          (click)="update()"
          [disabled]="!productForm.valid"
        >
          {{ 'dialog.update' | transloco }}
        </button>
      } @else if (data.duplicate) {
        <button
          mat-button
          color="primary"
          (click)="duplicate()"
          [disabled]="!productForm.valid"
        >
          {{ 'dialog.duplicate' | transloco }}
        </button>
      } @else {
        <button
          mat-button
          type="submit"
          (click)="create()"
          [disabled]="!productForm.valid"
        >
          {{ 'dialog.create' | transloco }}
        </button>
      }
    </mat-dialog-actions>
  </form>`,
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
export class CreateProductDialogComponent {
  productForm = new FormGroup({
    name: new FormControl('test', Validators.required),
    desc: new FormControl(''),
    price: new FormControl<number | undefined>(2, [
      Validators.required,
      Validators.min(0.0),
      Validators.max(100),
    ]),
    active: new FormControl(true),
  });

  isUpdate = false;
  dialogRef = inject(MatDialogRef<CreateProductDialogComponent>);
  assortmentService = inject(AssortmentService);

  data = inject<{ groupId: string; product?: Product; duplicate?: boolean }>(
    MAT_DIALOG_DATA,
  );

  constructor() {
    if (this.data.product !== undefined) {
      this.isUpdate = !(this.data.duplicate ?? false);
      this.productForm.patchValue({
        name: this.data.product.name,
        desc: this.data.product.desc,
        price: this.data.product.price / 100,
        active: this.data.product.active,
      });
    }
  }

  create() {
    if (this.productForm.valid) {
      const value = this.productForm.value;
      this.assortmentService
        .addProduct$({
          name: value.name ?? '',
          desc: value.desc ?? '',
          price: Math.round((value.price ?? 0) * 100),
          active: value.active ?? false,
          group_id: this.data.groupId,
        })
        .subscribe((product) => {
          this.dialogRef.close({ product, action: 'create' });
        });
    }
  }

  update() {
    if (this.productForm.valid) {
      const value = this.productForm.value;
      this.assortmentService
        .updateProduct$(this.data.product?.id ?? '', {
          name: value.name ?? '',
          desc: value.desc ?? '',
          active: value.active ?? false,
          price: Math.round((value.price ?? 0) * 100),
          group_id: this.data.groupId,
        })
        .subscribe((product) => {
          this.dialogRef.close({ product, action: 'edit' });
        });
    }
  }

  duplicate() {
    if (this.productForm.valid) {
      const value = this.productForm.value;
      this.assortmentService
        .addProduct$({
          name: value.name ?? '',
          desc: value.desc ?? '',
          price: Math.round((value.price ?? 0) * 100),
          active: value.active ?? false,
          group_id: this.data.groupId,
        })
        .subscribe((product) => {
          this.dialogRef.close({ product, action: 'duplicate' });
        });
    }
  }
}
