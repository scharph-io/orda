import { Injectable } from '@angular/core';
import { AssortmentGroup, AssortmentProduct } from '@core/models/assortment';
import { catchError, EMPTY, Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { EntityService } from '@shared/utils/entity-service';

@Injectable({
	providedIn: 'root',
})
export class AssortmentGroupService extends EntityService<AssortmentGroup> {
	resource = rxResource({
		loader: () => this.read(),
	});

	public read(): Observable<AssortmentGroup[]> {
		return this.httpClient
			.get<AssortmentGroup[]>(`${this.host}/assortment/groups`)
			.pipe(catchError(() => EMPTY));
	}

	public readById(id: string): Observable<AssortmentGroup> {
		return this.httpClient
			.get<AssortmentGroup>(`${this.host}/assortment/groups/${id}`)
			.pipe(catchError(() => EMPTY));
	}

	public create(ag: Partial<AssortmentGroup>): Observable<AssortmentGroup> {
		this.logger.debug('Create', ag, this.constructor.name);
		return this.httpClient.post<AssortmentGroup>(`${this.host}/assortment/groups`, ag);
	}

	public update(id: string, ag: Partial<AssortmentGroup>): Observable<AssortmentGroup> {
		this.logger.debug(`Update ${id} to`, ag, this.constructor.name);
		return this.httpClient.put<AssortmentGroup>(`${this.host}/assortment/groups/${id}`, ag);
	}

	public delete(id: string): Observable<unknown> {
		this.logger.debug('Delete', id, this.constructor.name);
		return this.httpClient
			.delete(`${this.host}/assortment/groups/${id}`)
			.pipe(catchError(() => EMPTY));
	}

	public readProductsByGroup(id: string): Observable<AssortmentProduct[]> {
		return this.httpClient
			.get<AssortmentProduct[]>(`${this.host}/assortment/groups/${id}/products`)
			.pipe(catchError(() => EMPTY));
	}

	public addNewProductToGroup(
		id: string,
		ap: Partial<AssortmentProduct>,
	): Observable<AssortmentProduct> {
		return this.httpClient.post<AssortmentProduct>(
			`${this.host}/assortment/groups/${id}/products`,
			ap,
		);
	}

	public deleteProductFromGroup(id: string, productId: string): Observable<unknown> {
		return this.httpClient
			.delete(`${this.host}/assortment/groups/${id}/products/${productId}`)
			.pipe(catchError(() => EMPTY));
	}
}
