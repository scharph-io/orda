import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HOST } from '@core/config/config';
import { LoginResponse, UserData } from '@core/models/login-response';
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

	public user = signal<UserData>({});

	constructor() {
		if (this.cookieService.check('session-user')) {
			this.getSessionData().subscribe({
				next: (res) => {
					this.user.set(res.data);
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				error: (_error) => {
					this.user.set({});
				},
			});
		}
	}

	login(username: string, password: string): Observable<LoginResponse<UserData>> {
		return this.httpClient
			.post<LoginResponse<UserData>>(`${this.host}/auth/login`, {
				username,
				password,
			})
			.pipe(
				tap((res) => {
					this.user.set(res.data);
				}),
			);
	}

	logout(): Observable<void> {
		return this.httpClient.post<void>(`${this.host}/auth/logout`, {}).pipe(
			tap(() => this.cookieService.deleteAll()),
			tap(() => this.user.set({})),
		);
	}

	isAuthenticated() {
		return this.cookieService.check('session-user');
	}

	private getSessionData() {
		return this.httpClient.get<LoginResponse<UserData>>(`${this.host}/auth/session`);
	}
}
