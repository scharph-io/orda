import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '@core/config/config';
import { Role } from '@core/models/role';
import { catchError, EMPTY } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RoleService {
	private readonly httpClient = inject(HttpClient);
	private readonly host = inject<string>(API);

	public getRoles() {
		return this.httpClient.get<Role[]>(`${this.host}/role`).pipe(catchError((_) => EMPTY));
	}

	public createRole(role: Role) {
		return this.httpClient.post(`${this.host}/role`, role).pipe(catchError((_) => EMPTY));
	}

	public deleteRole(id: string) {
		return (
			this.httpClient
				.delete(`${this.host}/role/${id}`)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.pipe(catchError((_) => EMPTY))
		);
	}
}
