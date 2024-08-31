import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { View } from '../model/view';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private path = '/api/views';

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) {}

  getViews$() {
    return this.http.get<View[]>(`${this.endpoint}${this.path}`);
  }

  getView$(id: string) {
    return this.http.get<View>(`${this.endpoint}${this.path}/${id}`);
  }

  addView$(view: View) {
    return this.http.post<{ data: View; message: string }>(
      `${this.endpoint}${this.path}`,
      view,
      {
        headers: this.headers,
      },
    );
  }

  deleteView$(id: string) {
    return this.http.delete<View>(`${this.endpoint}${this.path}/${id}`);
  }

  updateView$(id: string, view: View) {
    return this.http.put<View>(`${this.endpoint}${this.path}/${id}`, view, {
      headers: this.headers,
    });
  }
}