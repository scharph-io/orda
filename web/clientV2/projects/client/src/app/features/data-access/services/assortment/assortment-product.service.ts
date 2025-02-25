import { Injectable } from '@angular/core';
import { AssortmentProduct } from '@orda.core/models/assortment';
import { catchError, Observable } from 'rxjs';
import { EntityService } from '@orda.shared/utils/entity-service';
import { API_ENDPOINTS } from '@orda.core/constants';

@Injectable({
	providedIn: 'root',
})
export class AssortmentProductService extends EntityService<AssortmentProduct> {
	public read(): Observable<AssortmentProduct[]> {
		return this.httpClient
			.get<AssortmentProduct[]>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups`)
			.pipe(catchError(this.handleError));
	}

	public readById(id: string): Observable<AssortmentProduct> {
		return this.httpClient
			.get<AssortmentProduct>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups/${id}/products`)
			.pipe(catchError(this.handleError));
	}

	public create(ag: Partial<AssortmentProduct>): Observable<AssortmentProduct> {
		this.logger.debug('Create', ag, this.constructor.name);
		return this.httpClient
			.post<AssortmentProduct>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups`, ag)
			.pipe(catchError(this.handleError));
	}

	public update(id: string, ag: Partial<AssortmentProduct>): Observable<AssortmentProduct> {
		this.logger.debug(`Update ${id} to`, ag, this.constructor.name);
		return this.httpClient
			.put<AssortmentProduct>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups/${id}`, ag)
			.pipe(catchError(this.handleError));
	}

	public delete(id: string): Observable<unknown> {
		this.logger.debug('Delete', id, this.constructor.name);
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups/${id}`)
			.pipe(catchError(this.handleError));
	}
}
