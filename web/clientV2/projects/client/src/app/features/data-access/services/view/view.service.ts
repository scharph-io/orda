import { Injectable } from '@angular/core';
import { EntityService } from '@orda.shared/utils/entity-service';
import { View } from '@orda.core/models/view';
import { API_ENDPOINTS } from '@orda.core/constants';
import { catchError } from 'rxjs';
import { httpResource } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ViewService extends EntityService<View> {
	create(t: Partial<View>) {
		return this.httpClient
			.post<View>(`${this.HOST}${API_ENDPOINTS.VIEW}`, t)
			.pipe(catchError(this.handleError));
	}

	read() {
		return this.httpClient
			.get<View[]>(`${this.HOST}${API_ENDPOINTS.VIEW}`)
			.pipe(catchError(this.handleError));
	}

	readById(id: string) {
		return this.httpClient
			.get<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`)
			.pipe(catchError(this.handleError));
	}

	resourceById(id: string) {
		return httpResource<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`);
	}

	delete(id: string) {
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`)
			.pipe(catchError(this.handleError));
	}

	update(id: string, t: Partial<View>) {
		return this.httpClient
			.put<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`, t)
			.pipe(catchError(this.handleError));
	}

	setRoles(id: string, roleIds: string[]) {
		return this.httpClient
			.put<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}/roles`, roleIds)
			.pipe(catchError(this.handleError));
	}
}
