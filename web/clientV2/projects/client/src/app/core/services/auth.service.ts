import { inject, Injectable, resource, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HOST } from '@core/config/config';
import { LoginResponse, UserData } from '@core/models/login-response';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	host = inject<string>(HOST);
	httpClient = inject(HttpClient);
	router = inject(Router);

	storage = localStorage;

	isAuthenticated = signal(this.storage.getItem('data') !== null);

	public userData = resource<UserData, { status: boolean }>({
		// request: () => ({ status: this.isAuthenticated() }),
		loader: async ({ abortSignal }) =>
			(await fetch(`${this.host}/auth/user`, { signal: abortSignal })).json(),
	});

	login(username: string, password: string): Observable<LoginResponse<UserData>> {
		return this.httpClient
			.post<LoginResponse<UserData>>(`${this.host}/auth/login`, {
				username,
				password,
			})
			.pipe(
				tap(() => this.isAuthenticated.set(true)),
				tap((res) => this.storage.setItem('data', JSON.stringify(res.data))),
			);
	}

	logout(): Observable<void> {
		return this.httpClient.post<void>(`${this.host}/auth/logout`, {}).pipe(
			tap(() => this.isAuthenticated.set(false)),
			tap(() => this.storage.removeItem('data')),
		);
	}

	get authenticatedUser() {
		return JSON.parse(this.storage.getItem('data') || '{}') as UserData;
	}
}
