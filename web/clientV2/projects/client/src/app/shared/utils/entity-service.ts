import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { HOST } from '@orda.core/config/config';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { EMPTY, Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

export abstract class EntityService<T> {
	httpClient = inject(HttpClient);
	HOST = inject(HOST);
	logger = inject(OrdaLogger);

	public entityResource = rxResource({
		loader: () => this.read(),
	});

	public abstract create(t: Partial<T>): Observable<T>;

	public abstract read(): Observable<T[]>;

	public abstract readById(id: string): Observable<T>;

	public abstract update(id: string, t: Partial<T>): Observable<T>;

	public abstract delete(id: string): Observable<unknown>;

	protected handleError(error: unknown): Observable<never> {
		this.logger.error('An error occurred', error);
		return EMPTY;
	}
}
