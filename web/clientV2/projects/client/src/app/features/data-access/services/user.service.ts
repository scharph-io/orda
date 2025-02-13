import { Injectable } from '@angular/core';
import { User } from '@core/models/user';
import { catchError, EMPTY, Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { EntityService } from '@shared/utils/entity-service';

@Injectable({
	providedIn: 'root',
})
export class UserService extends EntityService<User> {
	constructor() {
		super();
	}

	resource = rxResource({
		loader: () => this.read(),
	});
	public read() {
		return this.httpClient.get<User[]>(`${this.host}/user`);
	}

	public override readById(id: string): Observable<User> {
		return this.httpClient.get<User>(`${this.host}/user/${id}`);
	}
	public create(u: User) {
		this.logger.debug('Create', u, this.constructor.name);
		return this.httpClient.post<User>(`${this.host}/user`, u);
	}
	public update(id: string, u: User) {
		this.logger.debug(`Update ${id} to`, u, this.constructor.name);
		return this.httpClient.put<User>(`${this.host}/user/${id}`, u);
	}
	public delete(id: string) {
		this.logger.debug('Delete', id, this.constructor.name);
		return this.httpClient.delete(`${this.host}/user/${id}`).pipe(catchError(() => EMPTY));
	}
}
