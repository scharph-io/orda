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

// Example ??? https://www.codeproject.com/Articles/5290817/Build-Angular-data-table-with-CRUD-operations-and
@Component({
  template: `
    <div class="container" style="margin: 1rem;">
      <h1>Manage</h1>

      <h2>Categories ({{ categories.length }})</h2>

      <!-- {{ this.categories | json }} -->
      <form [formGroup]="newCategory">
        <input type="text" formControlName="name" />
        <input type="text" formControlName="desc" />
        <button mat-raised-button color="primary" (click)="createCategory()">
          Create
        </button>
      </form>

      <table *ngIf="categories.length > 0">
        <tr *ngFor="let category of categories">
          <td>{{ category.name }}</td>
          <td>{{ category.desc }}</td>
          <td>
            <button
              mat-raised-button
              color="primary"
              (click)="selectedCategory = category"
            >
              Select
            </button>
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
  ],
})
export class ManageComponent {
  categoryService = inject(CategoryService);

  selectedCategory?: Category;
  categories: Category[] = [];

  newCategory = new FormGroup({
    name: new FormControl('', [Validators.required]),
    desc: new FormControl(''),
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
    this.categoryService
      .createCategory({
        name,
        desc,
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
  }
}
