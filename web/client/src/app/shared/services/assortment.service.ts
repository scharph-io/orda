import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Group, Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class AssortmentService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private path = '/api/assortment';

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) {}

  getGroups$() {
    return this.http.get<Group[]>(`${this.endpoint}${this.path}/groups`);
  }

  addGroup$(group: Group) {
    return this.http.post<{ data: Group; message: string }>(
      `${this.endpoint}${this.path}/groups`,
      group,
      {
        headers: this.headers,
      },
    );
  }

  deleteGroup$(id: string) {
    return this.http.delete<Group>(`${this.endpoint}${this.path}/groups/${id}`);
  }

  updateGroup$(id: string, group: Group) {
    return this.http.put<Group>(
      `${this.endpoint}${this.path}/groups/${id}`,
      group,
      {
        headers: this.headers,
      },
    );
  }

  getGroup$(id: string) {
    return this.http.get<Group>(`${this.endpoint}${this.path}/groups/${id}`);
  }

  getProductsByGroupId$(id: string) {
    return this.http.get<Product[]>(
      `${this.endpoint}${this.path}/products?group_id=${id}`,
    );
  }

  getProducts$() {
    return this.http.get<Product[]>(`${this.endpoint}${this.path}/products`);
  }

  addProduct$(product: Product) {
    return this.http.post<Product>(
      `${this.endpoint}${this.path}/products`,
      product,
      {
        headers: this.headers,
      },
    );
  }

  deleteProduct$(id: string) {
    return this.http.delete<Product>(
      `${this.endpoint}${this.path}/products/${id}`,
    );
  }

  deleteProductsByGroupId$(id: string) {
    return this.http.delete<Product[]>(
      `${this.endpoint}${this.path}/groups/${id}/products`,
    );
  }

  updateProduct$(id: string, product: Product) {
    return this.http.put<Product>(
      `${this.endpoint}${this.path}/products/${id}`,
      product,
      {
        headers: this.headers,
      },
    );
  }
}
