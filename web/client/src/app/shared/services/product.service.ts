import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) { }

  getProductsBy(categoryId: string) {
    return this.http.get<Product[]>(
      `${this.endpoint}/api/category/${categoryId}/product`,
    );
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.endpoint}/api/product/${id}`);
  }

  createProduct(product: Product) {
    console.log(product);
    return this.http.post(`${this.endpoint}/api/product`, product, {
      headers: this.headers,
    });
  }

  importProducts(products: Product[], categoryId: string) {
    return this.http.post(
      `${this.endpoint}/api/product/import?categoryId=${categoryId}`,
      products,
      {
        headers: this.headers,
      },
    );
  }

  updateProduct(id: string, product: Product) {
    return this.http.put<Product>(
      `${this.endpoint}/api/product/${id}`,
      product,
      { headers: this.headers },
    );
  }

  deleteProduct(id: string) {
    return this.http.delete<Product>(`${this.endpoint}/api/product/${id}`);
  }
}
