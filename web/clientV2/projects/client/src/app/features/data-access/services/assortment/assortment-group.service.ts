import { Injectable } from '@angular/core';
import { AssortmentGroup, AssortmentProduct } from '@orda.core/models/assortment';
import { catchError, EMPTY, Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { EntityService } from '@orda.shared/utils/entity-service';

export interface Message {
	message: string;
}

@Injectable({
	providedIn: 'root',
})
export class AssortmentGroupService extends EntityService<AssortmentGroup> {
	entityResource = rxResource({
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

	public readProductsByGroupId(id: string): Observable<AssortmentProduct[]> {
		this.logger.debug('read products from', id, this.constructor.name);
		return this.httpClient
			.get<AssortmentProduct[]>(`${this.host}/assortment/groups/${id}/products`)
			.pipe(catchError(() => EMPTY));
	}

	public addProductsByGroupId(id: string, ...products: AssortmentProduct[]): Observable<Message> {
		this.logger.debug(`add ${products.length} products to ${id}`, undefined, this.constructor.name);
		return this.httpClient.put<Message>(`${this.host}/assortment/groups/${id}/products`, products);
	}
}
