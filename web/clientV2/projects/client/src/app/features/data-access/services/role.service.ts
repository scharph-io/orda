import { Injectable } from '@angular/core';
import { Role } from '@orda.core/models/role';
import { catchError, EMPTY } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { EntityService } from '@orda.shared/utils/entity-service';

@Injectable({
	providedIn: 'root',
})
export class RoleService extends EntityService<Role> {
	constructor() {
		super();
	}

	entityResource = rxResource({
		loader: () => this.read(),
	});

	public read() {
		return this.httpClient.get<Role[]>(`${this.host}/role`).pipe(catchError(() => EMPTY));
	}

	public readById(id: string) {
		return this.httpClient.get<Role>(`${this.host}/role/${id}`).pipe(catchError(() => EMPTY));
	}

	public create(r: Partial<Role>) {
		this.logger.debug('Create', r, this.constructor.name);
		return this.httpClient.post<Role>(`${this.host}/role`, r);
	}

	public update(id: string, r: Partial<Role>) {
		this.logger.debug(`Update ${id} to`, r, this.constructor.name);
		return this.httpClient.put<Role>(`${this.host}/role/${id}`, r);
	}

	public delete(id: string) {
		this.logger.debug('Delete', id, this.constructor.name);
		return this.httpClient.delete(`${this.host}/role/${id}`).pipe(catchError(() => EMPTY));
	}
}
