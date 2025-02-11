import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '@core/config/config';
import { User } from '@core/models/user';
import { catchError, EMPTY } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Repository } from '@shared/utils/repository';

@Injectable({
	providedIn: 'root',
})
export class UserService implements Repository<User> {
	private readonly httpClient = inject(HttpClient);
	private readonly host = inject<string>(API);

	resource = rxResource({
		loader: () => this.read(),
	});

	public read() {
		return this.httpClient.get<User[]>(`${this.host}/user`).pipe(catchError(() => EMPTY));
	}

	public create(u: User) {
		return this.httpClient.post<User>(`${this.host}/user`, u);
	}

	public update(id: string, u: User) {
		return this.httpClient.put<User>(`${this.host}/user/${id}`, u);
	}

	public delete(id: string) {
		return this.httpClient.delete(`${this.host}/user/${id}`).pipe(catchError(() => EMPTY));
	}
}
