import { Component, inject, ViewChild } from '@angular/core';

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
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
// Example ??? https://www.codeproject.com/Articles/5290817/Build-Angular-data-table-with-CRUD-operations-and
@Component({
  template: `
    @if (accordion) {
      <button mat-button (click)="openCategoryDialog()">Add</button>
      <div class="example-action-buttons">
        <button mat-button (click)="accordion.openAll()">Expand All</button>
        <button mat-button (click)="accordion.closeAll()">Collapse All</button>
      </div>
    }
    <mat-accordion class="example-headers-align" multi>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> Personal data </mat-panel-title>
          <mat-panel-description>
            Type your name and age
            <mat-icon>account_circle</mat-icon>
          </mat-panel-description>
        </mat-expansion-panel-header>
      </mat-expansion-panel>
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
    `,
  ],
})
export class ManageComponent {
  @ViewChild(MatAccordion) accordion?: MatAccordion;

  categoryService = inject(CategoryService);

  selectedCategory?: Category;
  categories: Category[] = [];

  newCategory = new FormGroup({
    name: new FormControl('', [Validators.required]),
    desc: new FormControl(''),
    colored: new FormControl(false),
    withDeposit: new FormControl(false),
  });

  ngOnInit() {
    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories = categories;
      this.selectedCategory = categories[0];
    });
  }

  createCategory() {
    const name = this.newCategory.value.name ?? '';
    const desc = this.newCategory.value.desc ?? '';
    const colored = this.newCategory.value.colored ?? false;
    const withDeposit = this.newCategory.value.withDeposit ?? false;

    this.categoryService
      .createCategory({
        name,
        desc,
        colored,
        withDeposit,
      })

      .pipe(
        tap((res) => {
          this.selectedCategory = res.data;
        }),
        switchMap(() => this.categoryService.getCategories$()),
      )
      .subscribe((res) => {
        this.categoryService.getCategories$().subscribe((categories) => {
          this.categories = categories;
        });
      });

    this.newCategory.reset();
  }

  deleteCategory(id: string) {
    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories = categories;
      this.selectedCategory = categories[0];

      if (this.categories.find((c) => c.id === id)?.articles?.length !== 0) {
        // TODO: Use message service
        console.log("Can't delete category. Delete all articles first.");
        return;
      }

      this.categoryService
        .deleteCategory(id)
        .pipe(switchMap(() => this.categoryService.getCategories$()))
        .subscribe({
          next: (categories) => {
            this.categories = categories;
            this.selectedCategory = categories[0];
          },
          error: (_err) => {
            console.log("Can't delete category. Delete all articles first.");
          },
        });
    });
  }

  openCategoryDialog() {}
}

@Component({
  selector: 'orda-category-create-dialog',
  template: ``,
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
})
export class DialogElementsExampleDialog {}
