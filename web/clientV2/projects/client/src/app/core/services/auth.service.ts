import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HOST } from '@core/config/config';
import { LoginResponse, UserData } from '@core/models/login-response';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	httpClient = inject(HttpClient);
	cookie = inject(CookieService);
	router = inject(Router);
	host = inject<string>(HOST);

	public isAuthenticated = signal(false);

	// public userData = computed(() => {
	// 	if (this.isAuthenticated()) {
	// 	}
	// });
	//
	// constructor() {}

	// public userData = resource<UserData, { status: boolean }>({
	// 	request: () => ({ status: this.isAuthenticated() }),
	// 	loader: async ({ abortSignal }) => {
	// 		try {
	// 			const res = await fetch(`${this.host}/auth/session`, {
	// 				signal: abortSignal,
	// 			});
	// 			if (res.ok) {
	// 				return await res.json();
	// 			}
	// 			if (res.status === 404) throw new Error('404, Not found');
	// 			if (res.status === 500) throw new Error('500, internal server error');
	// 			// For any other server error
	// 			throw new Error(res.statusText);
	// 		} catch (err) {
	// 			console.error(err);
	// 		}
	// 	},
	// });

	// public userData = resource<UserData, boolean>({
	// 	request: () => ({ hasSession: this.hasSession() }),
	// 	loader: async ({ abortSignal }) => {
	// 		const response = await fetch(`${this.host}/auth/session`, {
	// 			signal: abortSignal,
	// 		});
	//
	// 		console.log('reload');
	//
	// 		if (!response.ok) throw new Error('Unable to load userdata!');
	// 		return await response.json();
	// 	},
	// });

	login(username: string, password: string): Observable<LoginResponse<UserData>> {
		return this.httpClient
			.post<LoginResponse<UserData>>(`${this.host}/auth/login`, {
				username,
				password,
			})
			.pipe(tap(() => this.isAuthenticated.set(true)));
	}

	logout(): Observable<void> {
		return this.httpClient.post<void>(`${this.host}/auth/logout`, {}).pipe(
			// tap(() => this.userData.destroy()),
			tap(() => this.isAuthenticated.set(false)),
		);
	}
}
