import { Injectable } from '@angular/core';
import { EntityService } from '@orda.shared/utils/entity-service';
import { View } from '@orda.core/models/view';
import { catchError, Observable } from 'rxjs';
import { API_ENDPOINTS } from '@orda.core/constants';

@Injectable({
  providedIn: 'root',
})
export class ViewProductService extends EntityService<View> {
  create(t: Partial<View>): Observable<View> {
    return this.httpClient
      .post<View>(`${this.HOST}${API_ENDPOINTS.VIEW}`, t)
      .pipe(catchError(this.handleError));
  }

  read(): Observable<View[]> {
    return this.httpClient
      .get<View[]>(`${this.HOST}${API_ENDPOINTS.VIEW}`)
      .pipe(catchError(this.handleError));
  }

  readById(id: string): Observable<View> {
    return this.httpClient
      .get<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<unknown> {
    return this.httpClient
      .delete(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`)
      .pipe(catchError(this.handleError));
  }

  update(id: string, t: Partial<View>): Observable<View> {
    return this.httpClient
      .put<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`, t)
      .pipe(catchError(this.handleError));
  }
}
