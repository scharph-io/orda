import { Component, effect, inject, signal } from '@angular/core';

import { ArticlesManageComponent } from './articles/articles-manage.component';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/model/category';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

// Example ??? https://www.codeproject.com/Articles/5290817/Build-Angular-data-table-with-CRUD-operations-and
@Component({
  template: `
    <div class="container" style="margin: 1rem;">
      <h1>Manage</h1>

      <h2>Categories ({{ categories.length }})</h2>

      <!-- {{ this.categories | json }} -->

      <button mat-raised-button color="primary" (click)="createCategory()">
        New Category
      </button>
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
  imports: [ArticlesManageComponent, MatButtonModule, CommonModule],
})
export class ManageComponent {
  categoryService = inject(CategoryService);

  selectedCategory?: Category;
  categories: Category[] = [];

  ngOnInit() {
    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories = categories;
      this.selectedCategory = categories[0];
    });
  }

  createCategory() {
    console.log('createCategory');
  }
}
