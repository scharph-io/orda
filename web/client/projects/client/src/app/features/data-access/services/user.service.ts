import { Injectable } from '@angular/core';
import { User } from '@orda.core/models/user';
import { catchError, Observable } from 'rxjs';
import { EntityService } from '@orda.shared/utils/entity-service';
import { API_ENDPOINTS } from '@orda.core/constants';

@Injectable({
	providedIn: 'root',
})
export class UserService extends EntityService<User> {
	public read() {
		return this.httpClient
			.get<User[]>(`${this.HOST}${API_ENDPOINTS.USER}`)
			.pipe(catchError(this.handleError));
	}

	public override readById(id: string): Observable<User> {
		return this.httpClient
			.get<User>(`${this.HOST}${API_ENDPOINTS.USER}/${id}`)
			.pipe(catchError(this.handleError));
	}

	public create(u: User) {
		return this.httpClient
			.post<User>(`${this.HOST}${API_ENDPOINTS.USER}`, u)
			.pipe(catchError(this.handleError));
	}

	public update(id: string, u: User) {
		this.logger.debug(`Update ${id} to`, u, this.constructor.name);
		return this.httpClient
			.put<User>(`${this.HOST}${API_ENDPOINTS.USER}/${id}`, u)
			.pipe(catchError(this.handleError));
	}

	public delete(id: string) {
		this.logger.debug('Delete', id, this.constructor.name);
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.USER}/${id}`)
			.pipe(catchError(this.handleError));
	}
}
