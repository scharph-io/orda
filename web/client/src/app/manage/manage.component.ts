import { Component, Inject, inject, signal, ViewChild } from '@angular/core';

import { ArticlesManageComponent } from './articles/articles-manage.component';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/model/category';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { OrdaCurrencyPipe } from '../shared/currency.pipe';

// Example ??? https://www.codeproject.com/Articles/5290817/Build-Angular-data-table-with-CRUD-operations-and
@Component({
  template: `
    <h1>
      {{ 'category.title' | transloco }}
      <span>
        <button
          mat-raised-button
          color="primary"
          (click)="openCategoryAddUpdateDialog()"
        >
          {{ 'category.add' | transloco }}
        </button></span
      >
    </h1>
    <mat-accordion class="example-headers-align">
      @for (category of categories(); track category) {
        <mat-expansion-panel #ex>
          <!-- <mat-expansion-panel-header [style.backgroundColor]="category.color"> -->
          <mat-expansion-panel-header>
            <mat-panel-title>
              <b>{{ category.name }}</b>
            </mat-panel-title>
            <mat-panel-description>
              {{ category.desc }}
            </mat-panel-description>
          </mat-expansion-panel-header>

          <ng-template matExpansionPanelContent>
            <p><b>ID:</b> {{ category.id }}</p>
            @if (category.withDeposit) {
              <p>
                <b>{{ 'deposit' | transloco }}:</b>
                {{ category.deposit | ordaCurrency }}
              </p>
            }
            <button
              mat-raised-button
              color="primary"
              (click)="openCategoryAddUpdateDialog(category)"
            >
              {{ 'category.edit' | transloco }}
            </button>
            @if (category.articles && category.articles.length > 0) {
              <button
                style="margin-top: 1em;"
                mat-raised-button
                color="info"
                (click)="export(category.id ?? '', category.name)"
              >
                {{ 'category.export' | transloco }}
              </button>
            }
            <button
              style="margin-top: 1em;"
              mat-raised-button
              color="warn"
              (click)="deleteCategory(category.id ?? '')"
            >
              {{ 'category.delete' | transloco }}
            </button>
            @if (ex.expanded) {
              <orda-articles-manage [category]="category" />
            }
          </ng-template>
        </mat-expansion-panel>
      }
    </mat-accordion>
  `,
  standalone: true,
  imports: [
    ArticlesManageComponent,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
    OrdaCurrencyPipe,
  ],
  styles: [
    `
      .example-action-buttons {
        padding-bottom: 20px;
      }

      .example-headers-align .mat-expansion-panel-header-description {
        justify-content: space-between;
        align-items: center;
      }

      .example-headers-align .mat-mdc-form-field + .mat-mdc-form-field {
        margin-left: 8px;
      }

      .example-headers-align {
        display: block;
        margin: 1em;
      }

      h1 {
        margin-left: 0.5em;
      }
    `,
  ],
})
export class ManageComponent {
  categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);

  dialog = inject(MatDialog);

  ngOnInit() {
    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  deleteCategory(id: string) {
    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories.set(categories);

      this.categoryService
        .deleteCategory(id)
        .pipe(switchMap(() => this.categoryService.getCategories$()))
        .subscribe({
          next: (categories) => {
            this.categories.set(categories);
          },
          error: (_err) => {
            console.log("Can't delete category. Delete all articles first.");
          },
        });
    });
  }

  openCategoryAddUpdateDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      data: { category },
      minWidth: '30rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.categoryService.getCategories$().subscribe((categories) => {
        this.categories?.set(categories);
      });
    });
  }

  export(id: string, name: string) {
    this.categoryService.exportCategoryArticles$(id, name).subscribe((b) => {
      console.log(b);
    });
  }
}

@Component({
  selector: 'orda-category-create-dialog',
  template: `<form [formGroup]="categoryForm">
    <h2 mat-dialog-title>
      @if (isUpdate) {
        {{ 'category.edit' | transloco }}
      } @else {
        {{ 'category.add' | transloco }}
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
        <mat-label>{{ 'table.color' | transloco }}</mat-label>
        <input matInput type="color" formControlName="color" />
      </mat-form-field>
      <mat-slide-toggle class="example-margin" formControlName="withDeposit">
        {{ 'table.show_deposit' | transloco }}
      </mat-slide-toggle>
      @if (categoryForm.get('withDeposit')?.value) {
        <mat-form-field>
          <mat-label>{{ 'table.deposit' | transloco }} (€)</mat-label>
          <input matInput type="number" formControlName="deposit" />
        </mat-form-field>
      }
      <mat-form-field>
        <mat-label>{{ 'table.position' | transloco }}</mat-label>
        <input matInput type="number" formControlName="position" />
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
          [disabled]="!categoryForm.valid"
        >
          {{ 'dialog.update' | transloco }}
        </button>
      } @else {
        <button
          mat-button
          type="submit"
          (click)="create()"
          [disabled]="!categoryForm.valid"
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
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
})
export class CreateCategoryDialogComponent {
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    desc: new FormControl(''),
    color: new FormControl(''),
    withDeposit: new FormControl(false),
    deposit: new FormControl(1),
    position: new FormControl(0),
  });

  categoryService = inject(CategoryService);

  isUpdate = false;

  constructor(
    public dialogRef: MatDialogRef<CreateCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { category?: Category },
  ) {
    if (this.data.category !== undefined) {
      this.isUpdate = true;
      this.categoryForm.patchValue({
        name: this.data.category.name,
        desc: this.data.category.desc,
        color: this.data.category.color,
        withDeposit: this.data.category.withDeposit,
        deposit: (this.data.category.deposit ?? 0) / 100,
        position: this.data.category.position,
      });
    }
  }

  create() {
    if (this.categoryForm.valid) {
      const value = this.categoryForm.value;
      this.categoryService
        .createCategory({
          name: value.name ?? '',
          desc: value.desc ?? '',
          color: value.color ?? '',
          withDeposit: value.withDeposit ?? false,
          deposit: Math.round((value.deposit ?? 0) * 100),
          position: value.position ?? 0,
        })
        .subscribe((res) => {
          this.dialogRef.close();
        });
    }
  }

  update() {
    if (this.categoryForm.valid) {
      const value = this.categoryForm.value;

      this.categoryService
        .updateCategory(this.data.category?.id ?? '', {
          name: value.name ?? '',
          desc: value.desc ?? '',
          withDeposit: value.withDeposit ?? false,
          color: value.color ?? '',
          deposit: Math.round((value.deposit ?? 0) * 100),
          position: value.position ?? 0,
        })
        .subscribe((c) => {
          console.log(c);
          this.dialogRef.close();
        });
    }
  }
}
