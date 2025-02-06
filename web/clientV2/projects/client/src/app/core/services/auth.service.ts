import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

	isAuthenticatedNew = new BehaviorSubject<boolean>(false);

	constructor() {
		if (this.cookieService.check('session-user')) {
			this.checkSession().subscribe({
				next: (data) => {
					console.log(data);
					this.isAuthenticatedNew.next(true);
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				error: (_error) => {
					this.isAuthenticatedNew.next(false);
				},
			});
		}
	}

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

	get isAuthenticated$() {
		return this.isAuthenticatedNew.asObservable();
	}

	getAuthenticatedUser(): UserData {
		const userData = this.cookieService.get('session-user');
		return userData !== '' ? (JSON.parse(userData) as UserData) : {};
	}

	checkSession() {
		return this.httpClient.get<LoginResponse<UserData>>(`${this.host}/auth/session`);
	}
}
