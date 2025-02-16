import { HttpClient } from '@angular/common/http';
import { inject, ResourceRef } from '@angular/core';
import { API } from '@orda.core/config/config';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { Observable } from 'rxjs';

export abstract class EntityService<T> {
	httpClient = inject(HttpClient);
	host = inject<string>(API);
	logger = inject(OrdaLogger);

	public abstract entityResource: ResourceRef<T[] | undefined>;

	public abstract create(t: Partial<T>): Observable<T>;

	public abstract read(): Observable<T[]>;

	public abstract readById(id: string): Observable<T>;

	public abstract update(id: string, t: Partial<T>): Observable<T>;

	public abstract delete(id: string): Observable<unknown>;
}
