import { ResourceRef } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class Repository<T> {
	public abstract resource: ResourceRef<T[] | undefined>;

	public abstract create(t: T): Observable<T>;

	public abstract read(): Observable<T[]>;

	public abstract update(id: string, t: T): Observable<T>;

	public abstract delete(id: string): Observable<unknown>;
}
