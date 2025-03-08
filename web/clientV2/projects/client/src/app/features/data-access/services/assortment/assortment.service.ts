import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { AssortmentGroup, AssortmentProduct } from '@orda.core/models/assortment';
import { API_ENDPOINTS } from '@orda.core/constants';
import { HttpClient } from '@angular/common/http';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { HOST } from '@orda.core/config/config';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
	providedIn: 'root',
})
export class AssortmentService {
	private httpClient = inject(HttpClient);
	HOST = inject(HOST);
	logger = inject(OrdaLogger);

	public groups = rxResource({
		loader: () => this.readGroups(),
	});

	public readGroups(): Observable<AssortmentGroup[]> {
		this.logger.debug('[readGroups]', undefined, this.constructor.name);
		return this.httpClient
			.get<AssortmentGroup[]>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/group`)
			.pipe(catchError(this.handleError));
	}

	public readGroupById(id: string): Observable<AssortmentGroup> {
		this.logger.debug('[readGroupById]', id, this.constructor.name);

		return this.httpClient
			.get<AssortmentGroup>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/group/${id}`)
			.pipe(catchError(this.handleError));
	}

	public createGroup(ag: Partial<AssortmentGroup>): Observable<AssortmentGroup> {
		this.logger.debug('[create]', ag, this.constructor.name);
		return this.httpClient
			.post<AssortmentGroup>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/group`, ag)
			.pipe(catchError(this.handleError));
	}

	public updateGroup(id: string, ag: Partial<AssortmentGroup>): Observable<AssortmentGroup> {
		this.logger.debug(`[update] ${id}`, ag, this.constructor.name);
		return this.httpClient
			.put<AssortmentGroup>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/group/${id}`, ag)
			.pipe(catchError(this.handleError));
	}

	public deleteGroup(id: string): Observable<unknown> {
		this.logger.debug('[delete]', id, this.constructor.name);
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/group/${id}`)
			.pipe(catchError(this.handleError));
	}

	public readProductsByGroupId(id: string): Observable<AssortmentProduct[]> {
		this.logger.debug('[readProductsByGroupId]', id, this.constructor.name);
		return this.httpClient
			.get<AssortmentProduct[]>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/group/${id}/products`)
			.pipe(catchError(this.handleError));
	}

	public addProducts(
		agId: string,
		ap: Partial<AssortmentProduct>[],
	): Observable<AssortmentProduct> {
		this.logger.debug('[createProduct]', ap, this.constructor.name);
		return this.httpClient
			.post<AssortmentProduct>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/group/${agId}/products`, ap)
			.pipe(catchError(this.handleError));
	}

	public readProductById(apId: string): Observable<AssortmentProduct> {
		this.logger.debug(`[readProductById]`, apId, this.constructor.name);
		return this.httpClient
			.get<AssortmentProduct>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/product/${apId}`)
			.pipe(catchError(this.handleError));
	}

	public updateProduct(
		apId: string,
		ap: Partial<AssortmentProduct>,
	): Observable<AssortmentProduct> {
		this.logger.debug(`[updateProduct]`, apId, this.constructor.name);
		return this.httpClient
			.put<AssortmentProduct>(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/product/${apId}`, ap)
			.pipe(catchError(this.handleError));
	}

	public removeProduct(id: string): Observable<unknown> {
		this.logger.debug(`[deleteProduct]`, id, this.constructor.name);
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/product/${id}`)
			.pipe(catchError(this.handleError));
	}

	public toggleProduct(id: string): Observable<AssortmentProduct> {
		this.logger.debug(`[toggleProduct]`, id, this.constructor.name);
		return this.httpClient
			.patch<AssortmentProduct>(
				`${this.HOST}${API_ENDPOINTS.ASSORTMENT}/product/${id}/toggle`,
				undefined,
			)
			.pipe(catchError(this.handleError));
	}

	protected handleError(error: unknown): Observable<never> {
		this.logger.error(`[${this.constructor.name}] An error occurred`, error);
		return EMPTY;
	}
}
