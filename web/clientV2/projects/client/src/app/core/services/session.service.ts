import { computed, inject, Injectable, signal } from '@angular/core';
import { HOST } from '@orda.core/config/config';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, SessionInfo } from '@orda.core/models/login-response';
import { tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SessionService {
	private readonly host = inject<string>(HOST);
	private readonly httpClient = inject(HttpClient);

	user = signal<SessionInfo>({});

	isAuthenticated = computed(() => !!this.user().username);

	constructor() {
		// this.checkSession();
	}

	checkSession() {
		console.log('Checking session');
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			this.user.set(JSON.parse(storedUser));
		}
		return this.httpClient.get<SessionInfo>(`${this.host}/auth/session`);
	}

	public logout() {
		console.log('Removing user from local storage');
		localStorage.removeItem('user');
		this.user.set({});
		return this.httpClient.post<void>(`${this.host}/auth/logout`, {});
	}

	public login(username: string, password: string) {
		return this.httpClient
			.post<LoginResponse<SessionInfo>>(`${this.host}/auth/login`, {
				username,
				password,
			})
			.pipe(
				tap((res) => {
					this.user.set(res.data);
					localStorage.setItem('user', JSON.stringify(res.data));
				}),
			);
	}
}
