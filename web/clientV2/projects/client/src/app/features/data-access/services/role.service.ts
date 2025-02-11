import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '@core/config/config';
import { Role } from '@core/models/role';
import { catchError, EMPTY } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
	providedIn: 'root',
})
export class RoleService {
	private readonly httpClient = inject(HttpClient);
	private readonly host = inject<string>(API);

	// Reactive resource for roles
	resource = rxResource({
		loader: () => this.httpClient.get<Role[]>(`${this.host}/role`),
	});

	public getRoles() {
		return this.httpClient.get<Role[]>(`${this.host}/role`).pipe(catchError(() => EMPTY));
	}

	public createRole(role: Role) {
		return this.httpClient.post(`${this.host}/role`, role).pipe(catchError(() => EMPTY));
	}

	public deleteRole(id: string) {
		return (
			this.httpClient
				.delete(`${this.host}/role/${id}`)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.pipe(catchError((_) => EMPTY))
		);
	}

	public updateRole(id: string, role: Role) {
		return this.httpClient.put(`${this.host}/role/${id}`, role);
	}
}
