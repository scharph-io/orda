import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
import { ArticleService } from '../shared/services/article.service';

@Component({
  selector: 'orda-create-article-dialog',
  template: `<form [formGroup]="articleForm" (ngSubmit)="onSubmit()">
    <h2 mat-dialog-title>Create Article</h2>
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
      <button mat-button type="submit" [disabled]="!articleForm.valid">
        Create
      </button>
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
    name: new FormControl('sd', Validators.required),
    desc: new FormControl('sd'),
    price: new FormControl(4.2, [
      Validators.required,
      Validators.min(0.1),
      Validators.max(100),
    ]),
    active: new FormControl(true),
  });

  articleService = inject(ArticleService);

  constructor(public dialogRef: MatDialogRef<CreateArticleDialogComponent>) {}

  onSubmit() {
    console.log('onSubmit');
    if (this.articleForm.valid) {
      const value = this.articleForm.value;

      this.articleService.createArticle({
        name: value.name ?? '',
        desc: value.desc ?? '',
        price: value.price ?? 0,
        active: value.active ?? false,
      });
    }
  }
}
