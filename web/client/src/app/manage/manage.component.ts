import { Component, effect, inject, signal } from '@angular/core';

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

// Example ??? https://www.codeproject.com/Articles/5290817/Build-Angular-data-table-with-CRUD-operations-and
@Component({
  template: `
    <div class="container">
      <h1>Manage</h1>

      <h2>Categories ({{ categories.length }})</h2>

      <!-- {{ this.categories | json }} -->
      <form [formGroup]="newCategory">
        <input type="text" formControlName="name" />
        <input type="text" formControlName="desc" />
        <mat-slide-toggle formControlName="colored">Colored </mat-slide-toggle>
        <mat-slide-toggle formControlName="withDeposit"
          >Deposit
        </mat-slide-toggle>
        <button mat-raised-button color="primary" (click)="createCategory()">
          Create
        </button>
      </form>

      <table *ngIf="categories.length > 0">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Colored</th>
          <th>Deposit</th>
          <th>Actions</th>
        </tr>
        <tr
          *ngFor="let category of categories"
          (click)="selectedCategory = category"
        >
          <td>{{ category.name }}</td>
          <td>{{ category.desc }}</td>
          <mat-slide-toggle
            [checked]="category.colored"
            disabled
          ></mat-slide-toggle>
          <mat-slide-toggle
            [checked]="category.withDeposit"
            disabled
          ></mat-slide-toggle>
          <td>
            <!-- TODO: Hide delete if articles are not 0 -->
            @if (category.id !== undefined) {
              <button mat-icon-button (click)="deleteCategory(category.id)">
                <mat-icon mat-icon-button color="warn">delete</mat-icon>
              </button>
            }
          </td>
        </tr>
      </table>

      @if (categories.length > 0 && selectedCategory !== undefined) {
        <orda-articles-manage [category]="selectedCategory" />
      }
    </div>
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
  ],
  styles: [
    `
      .test {
        border: 1px solid red;
      }
    `,
  ],
})
export class ManageComponent {
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
}
