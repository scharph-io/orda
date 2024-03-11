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
import { ArticleService } from '../../shared/services/article.service';
import { Article } from '../../shared/model/article';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'orda-create-article-dialog',
  template: `<form [formGroup]="articleForm">
    <h2 mat-dialog-title>
      @if (isUpdate) {
        Update
      } @else {
        Create
      }
      Article
    </h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <input matInput formControlName="desc" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Price</mat-label>
        <input matInput type="number" formControlName="price" />
      </mat-form-field>
      <mat-slide-toggle class="example-margin" formControlName="active">
        Active
      </mat-slide-toggle>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      @if (isUpdate) {
        <button
          mat-button
          color="primary"
          (click)="update()"
          [disabled]="!articleForm.valid"
        >
          Update
        </button>
      } @else {
        <button
          mat-button
          type="submit"
          (click)="create()"
          [disabled]="!articleForm.valid"
        >
          Create
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
  ],
})
export class CreateArticleDialogComponent {
  articleForm = new FormGroup({
    name: new FormControl('', Validators.required),
    desc: new FormControl(''),
    price: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(0.1),
      Validators.max(100),
    ]),
    active: new FormControl(true),
  });

  articleService = inject(ArticleService);

  isUpdate = false;

  constructor(
    public dialogRef: MatDialogRef<CreateArticleDialogComponent>,
    public messageService: MessageService,
    @Inject(MAT_DIALOG_DATA)
    public data: { article?: Article; categoryId: string },
  ) {
    if (this.data.article !== undefined) {
      this.isUpdate = true;
      this.articleForm.patchValue({
        name: this.data.article.name,
        desc: this.data.article.desc,
        price: this.data.article.price / 100,
        active: this.data.article.active,
      });
    }
  }

  create() {
    if (this.articleForm.valid) {
      const value = this.articleForm.value;

      this.articleService
        .createArticle({
          name: value.name ?? '',
          desc: value.desc ?? '',
          price: Math.round((value.price ?? 0) * 100),
          active: value.active ?? false,
          categoryId: this.data.categoryId,
        })
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  update() {
    if (this.articleForm.valid) {
      const value = this.articleForm.value;

      this.articleService
        .updateArticle(this.data.article?.id ?? '', {
          name: value.name ?? '',
          desc: value.desc ?? '',
          price: Math.round((value.price ?? 0) * 100),
          active: value.active ?? false,
          categoryId: this.data.categoryId,
        })
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }
}
