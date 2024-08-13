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
import { Product } from '../../../shared/model/product';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'orda-create-group-dialog',
  template: `<form [formGroup]="groupForm">
    <h2 mat-dialog-title>
      @if (isUpdate) {
        {{ 'group.edit' | transloco }}
      } @else {
        {{ 'group.add' | transloco }}
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
          [disabled]="!groupForm.valid"
        >
          {{ 'dialog.update' | transloco }}
        </button>
      } @else {
        <button
          mat-button
          type="submit"
          (click)="create()"
          [disabled]="!groupForm.valid"
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
export class CreateGroupDialogComponent {
  groupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    desc: new FormControl(''),
    price: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(0.1),
      Validators.max(100),
    ]),
    active: new FormControl(true),
    position: new FormControl<number>(1),
  });

  //   productService = inject(ProductService);

  isUpdate = false;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    // public messageService: MessageService,
    // @Inject(MAT_DIALOG_DATA)
    // public data: { product?: Grouop; categoryId: string },
  ) {
    // if (this.data.product !== undefined) {
    //   this.isUpdate = true;
    //   this.productForm.patchValue({
    //     name: this.data.product.name,
    //     desc: this.data.product.desc,
    //     price: this.data.product.price / 100,
    //     active: this.data.product.active,
    //     position: this.data.product.position,
    //   });
    // }
  }

  create() {
    // if (this.productForm.valid) {
    //   const value = this.productForm.value;
    //   this.productService
    //     .createProduct({
    //       name: value.name ?? '',
    //       desc: value.desc ?? '',
    //       price: Math.round((value.price ?? 0) * 100),
    //       active: value.active ?? false,
    //       categoryId: this.data.categoryId,
    //       position: value.position ?? 0,
    //     })
    //     .subscribe((res) => {
    //       console.log(res);
    //       this.dialogRef.close();
    //     });
    // }
  }

  update() {
    // console.log(this.productForm.value);
    // if (this.productForm.valid) {
    //   const value = this.productForm.value;
    //   this.productService
    //     .updateProduct(this.data.product?.id ?? '', {
    //       name: value.name ?? '',
    //       desc: value.desc ?? '',
    //       price: Math.round((value.price ?? 0) * 100),
    //       active: value.active ?? false,
    //       categoryId: this.data.categoryId,
    //       position: value.position ?? 0,
    //     })
    //     .subscribe(() => {
    //       this.dialogRef.close();
    //     });
    // }
  }
}
