import { Injectable } from '@angular/core';
import { EntityService } from '@orda.shared/utils/entity-service';
import { ViewGroup } from '@orda.core/models/view';
import { API_ENDPOINTS } from '@orda.core/constants';
import { catchError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ViewGroupService extends EntityService<ViewGroup> {
	create(t: Partial<ViewGroup>) {
		return this.httpClient
			.post<ViewGroup>(`${this.HOST}${API_ENDPOINTS.VIEW_GROUP}`, t)
			.pipe(catchError(this.handleError));
	}

	read() {
		return this.httpClient
			.get<ViewGroup[]>(`${this.HOST}${API_ENDPOINTS.VIEW_GROUP}`)
			.pipe(catchError(this.handleError));
	}

	readById(id: string) {
		return this.httpClient
			.get<ViewGroup>(`${this.HOST}${API_ENDPOINTS.VIEW_GROUP}/${id}`)
			.pipe(catchError(this.handleError));
	}

	delete(id: string) {
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.VIEW_GROUP}/${id}`)
			.pipe(catchError(this.handleError));
	}

	update(id: string, t: Partial<ViewGroup>) {
		return this.httpClient
			.put<ViewGroup>(`${this.HOST}${API_ENDPOINTS.VIEW_GROUP}/${id}`, t)
			.pipe(catchError(this.handleError));
	}
}
