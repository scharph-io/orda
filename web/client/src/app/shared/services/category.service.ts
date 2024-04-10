import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Category } from '../model/category';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) { }

  getCategories$(user?: string) {
    // TODO: Workaround for the user parameter
    if (user) {
      return this.http.get<Category[]>(
        `${this.endpoint}/api/category?user=${user}`,
      );
    } else {
      return this.http.get<Category[]>(`${this.endpoint}/api/category`);
    }
  }

  getCategory(id: string) {
    return this.http.get<Category>(`${this.endpoint}/api/category/${id}`);
  }

  createCategory(category: Category) {
    return this.http.post<{ data: Category; message: string }>(
      `${this.endpoint}/api/category`,
      category,
      {
        headers: this.headers,
      },
    );
  }

  updateCategory(id: string, c: Category) {
    return this.http.put<Category>(`${this.endpoint}/api/category/${id}`, c, {
      headers: this.headers,
    });
  }

  deleteCategory(id: string) {
    return this.http.delete<Category>(`${this.endpoint}/api/category/${id}`);
  }

  exportCategoryProducts$(id: string, name: string) {
    return this.http
      .get(
        `${this.endpoint}/api/category/export/${id}/product?name=${name.toLocaleLowerCase().replaceAll(' ', '_')}.json`,
        {
          responseType: 'blob',
        },
      )
      .pipe(
        map((data) => {
          const blob = new Blob([data], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const fileName = `${name.toLocaleLowerCase().replaceAll(' ', '_')}.json`;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }),
      );
  }
}
