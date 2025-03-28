import { Injectable } from '@angular/core';
import { EntityService } from '@orda.shared/utils/entity-service';
import { View, ViewProduct } from '@orda.core/models/view';
import { API_ENDPOINTS } from '@orda.core/constants';
import { catchError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ViewService extends EntityService<View> {
	create(v: Partial<View>) {
		return this.httpClient
			.post<View>(`${this.HOST}${API_ENDPOINTS.VIEW}`, v)
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

	delete(id: string) {
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`)
			.pipe(catchError(this.handleError));
	}

	update(id: string, v: Partial<View>) {
		console.log(v);
		return this.httpClient
			.put<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}`, v)
			.pipe(catchError(this.handleError));
	}

	setRoles(id: string, roleIds: string[]) {
		return this.httpClient
			.put<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}/roles`, roleIds)
			.pipe(catchError(this.handleError));
	}

	getRoles(view_id: string) {
		return this.httpClient
			.get<View[]>(`${this.HOST}${API_ENDPOINTS.VIEW}/${view_id}/roles`)
			.pipe(catchError(this.handleError));
	}

	setProducts(id: string, viewProducts: Partial<ViewProduct>[]) {
		return this.httpClient
			.put<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}/products?overwrite=true`, viewProducts)
			.pipe(catchError(this.handleError));
	}

	addProducts(id: string, viewProducts: Partial<ViewProduct>[]) {
		return this.httpClient
			.put<View>(`${this.HOST}${API_ENDPOINTS.VIEW}/${id}/products`, viewProducts)
			.pipe(catchError(this.handleError));
	}

	getProducts(view_id: string) {
		return this.httpClient
			.get<ViewProduct[]>(`${this.HOST}${API_ENDPOINTS.VIEW}/${view_id}/products`)
			.pipe(catchError(this.handleError));
	}
}
