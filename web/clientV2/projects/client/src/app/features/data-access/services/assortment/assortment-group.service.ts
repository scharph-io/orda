import { Injectable } from '@angular/core';
import { AssortmentGroup, AssortmentProduct } from '@orda.core/models/assortment';
import { catchError, Observable } from 'rxjs';
import { EntityService } from '@orda.shared/utils/entity-service';
import { API_ENDPOINTS } from '@orda.core/constants';

export interface Message {
	message: string;
}

@Injectable({
	providedIn: 'root',
})
export class AssortmentGroupService extends EntityService<AssortmentGroup> {
	public read(): Observable<AssortmentGroup[]> {
		return this.httpClient
			.get<AssortmentGroup[]>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups`)
			.pipe(catchError(this.handleError));
	}

	public readById(id: string): Observable<AssortmentGroup> {
		return this.httpClient
			.get<AssortmentGroup>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups/${id}`)
			.pipe(catchError(this.handleError));
	}

	public create(ag: Partial<AssortmentGroup>): Observable<AssortmentGroup> {
		this.logger.debug('Create', ag, this.constructor.name);
		return this.httpClient
			.post<AssortmentGroup>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups`, ag)
			.pipe(catchError(this.handleError));
	}

	public update(id: string, ag: Partial<AssortmentGroup>): Observable<AssortmentGroup> {
		this.logger.debug(`Update ${id} to`, ag, this.constructor.name);
		return this.httpClient
			.put<AssortmentGroup>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups/${id}`, ag)
			.pipe(catchError(this.handleError));
	}

	public delete(id: string): Observable<unknown> {
		this.logger.debug('Delete', id, this.constructor.name);
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups/${id}`)
			.pipe(catchError(this.handleError));
	}

	public readProductsByGroupId(id: string): Observable<AssortmentProduct[]> {
		this.logger.debug('read products from', id, this.constructor.name);
		return this.httpClient
			.get<AssortmentProduct[]>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups/${id}/products`)
			.pipe(catchError(this.handleError));
	}

	public addProductsByGroupId(id: string, ...products: AssortmentProduct[]): Observable<Message> {
		this.logger.debug(`add ${products.length} products to ${id}`, undefined, this.constructor.name);
		return this.httpClient
			.put<Message>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/groups/${id}/products`, products)
			.pipe(catchError(this.handleError));
	}
}
