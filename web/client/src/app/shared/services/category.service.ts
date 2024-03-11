import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) {}

  getCategories$() {
    return this.http.get<Category[]>(`${this.endpoint}/api/category`);
  }

  getCategory(id: string) {
    return this.http.get<Category>(`${this.endpoint}/api/category/${id}`);
  }

  createCategory(category: Category) {
    return this.http.post(`${this.endpoint}/api/category`, category, {
      headers: this.headers,
    });
  }

  updateCategory(id: string, Category: Category) {
    return this.http.put<Category>(
      `${this.endpoint}/api/category/${id}`,
      Category,
      { headers: this.headers },
    );
  }

  deleteCategory(id: string) {
    return this.http.delete<Category>(`${this.endpoint}/api/category/${id}`);
  }
}
