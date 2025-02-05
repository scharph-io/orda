import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HOST } from '@core/config/config';
import { LoginResponse } from '@core/models/login-response';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export interface UserData {
	user?: string;
	role?: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	host = inject<string>(HOST);
	httpClient = inject(HttpClient);
	router = inject(Router);
	cookieService = inject(CookieService);

	login(username: string, password: string): Observable<LoginResponse<UserData>> {
		return this.httpClient.post<LoginResponse<UserData>>(`${this.host}/auth/login`, {
			username,
			password,
		});
	}

	logout(): Observable<void> {
		return this.httpClient
			.post<void>(`${this.host}/auth/logout`, {})
			.pipe(tap(() => this.cookieService.deleteAll()));
	}

	refreshSession() {
		return this.httpClient.get<LoginResponse<UserData>>(`${this.host}/auth/session`);
	}

	isAuthenticated() {
		return this.cookieService.check('session-user');
	}

	getAuthenticatedUser(): UserData {
		const userData = this.cookieService.get('session-user');
		return userData !== '' ? (JSON.parse(userData) as UserData) : {};
	}
}
