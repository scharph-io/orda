import { Injectable } from '@angular/core';
import { AssortmentProduct } from '@orda.core/models/assortment';
import { catchError, EMPTY, Observable } from 'rxjs';
import { EntityService } from '@orda.shared/utils/entity-service';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
	providedIn: 'root',
})
export class AssortmentProductService extends EntityService<AssortmentProduct> {
	entityResource = rxResource({
		loader: () => this.read(),
	});

	public read(): Observable<AssortmentProduct[]> {
		return this.httpClient
			.get<AssortmentProduct[]>(`${this.host}/assortment/groups`)
			.pipe(catchError(() => EMPTY));
	}

	public readById(id: string): Observable<AssortmentProduct> {
		return this.httpClient
			.get<AssortmentProduct>(`${this.host}/assortment/groups/${id}/products`)
			.pipe(catchError(() => EMPTY));
	}

	public create(ag: Partial<AssortmentProduct>): Observable<AssortmentProduct> {
		this.logger.debug('Create', ag, this.constructor.name);
		return this.httpClient.post<AssortmentProduct>(`${this.host}/assortment/groups`, ag);
	}

	public update(id: string, ag: Partial<AssortmentProduct>): Observable<AssortmentProduct> {
		this.logger.debug(`Update ${id} to`, ag, this.constructor.name);
		return this.httpClient.put<AssortmentProduct>(`${this.host}/assortment/groups/${id}`, ag);
	}

	public delete(id: string): Observable<unknown> {
		this.logger.debug('Delete', id, this.constructor.name);
		return this.httpClient
			.delete(`${this.host}/assortment/groups/${id}`)
			.pipe(catchError(() => EMPTY));
	}
}
