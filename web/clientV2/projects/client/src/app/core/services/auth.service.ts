import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HOST } from '@core/config/config';
import { LoginResponse, SessionInfo } from '@core/models/login-response';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	host = inject<string>(HOST);
	httpClient = inject(HttpClient);
	router = inject(Router);
	cookieService = inject(CookieService);

	public user = signal<SessionInfo>({});

	constructor() {
		if (this.hasSessionUser()) {
			this.getSessionData().subscribe({
				next: (res) => {
					this.user.set(res);
				},
				error: () => {
					this.user.set({});
				},
			});
		}
	}

	login(username: string, password: string) {
		return this.httpClient.post<LoginResponse<SessionInfo>>(`${this.host}/auth/login`, {
			username,
			password,
		});
	}

	logout() {
		return this.httpClient
			.post<void>(`${this.host}/auth/logout`, {})
			.pipe(tap(() => this.cookieService.deleteAll()));
	}

	isAuthenticated() {
		return this.cookieService.check('session-user');
	}

	public getSessionData() {
		return this.httpClient.get<SessionInfo>(`${this.host}/auth/session`);
	}

	public hasSessionUser() {
		return this.cookieService.check('session-user');
	}
}
