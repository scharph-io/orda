import { Injectable } from '@angular/core';
import { Role } from '@orda.core/models/role';
import { catchError } from 'rxjs';
import { EntityService } from '@orda.shared/utils/entity-service';
import { API_ENDPOINTS } from '@orda.core/constants';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends EntityService<Role> {
  public read() {
    return this.httpClient
      .get<Role[]>(`${this.HOST}${API_ENDPOINTS.ROLE}`)
      .pipe(catchError(this.handleError));
  }

  public readById(id: string) {
    return this.httpClient
      .get<Role>(`${this.HOST}${API_ENDPOINTS.ROLE}/${id}`)
      .pipe(catchError(this.handleError));
  }

  public create(r: Partial<Role>) {
    this.logger.debug('Create', r, this.constructor.name);
    return this.httpClient
      .post<Role>(`${this.HOST}${API_ENDPOINTS.ROLE}`, r)
      .pipe(catchError(this.handleError));
  }

  public update(id: string, r: Partial<Role>) {
    this.logger.debug(`Update ${id} to`, r, this.constructor.name);
    return this.httpClient
      .put<Role>(`${this.HOST}${API_ENDPOINTS.ROLE}/${id}`, r)
      .pipe(catchError(this.handleError));
  }

  public delete(id: string) {
    this.logger.debug('Delete', id, this.constructor.name);
    return this.httpClient
      .delete(`${this.HOST}${API_ENDPOINTS.ROLE}/${id}`)
      .pipe(catchError(this.handleError));
  }
}
