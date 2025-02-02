import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

	private isAuthenticatedSubject: BehaviorSubject<boolean>;
	public isAuthenticated: Observable<boolean>;

	private dataSubject: BehaviorSubject<UserData>;
	public data: Observable<UserData>;

	constructor() {
		this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
		this.isAuthenticated = this.isAuthenticatedSubject.asObservable();

		this.dataSubject = new BehaviorSubject<UserData>({ username: '', role: '' });
		this.data = this.dataSubject.asObservable();
	}

	login(username: string, password: string): Observable<LoginResponse<UserData>> {
		return this.httpClient
			.post<LoginResponse<UserData>>(`${this.host}/auth/login`, {
				username,
				password,
			})
			.pipe
			// tap((res) => this.dataSubject.next(res.data)),
			// tap(() => this.isAuthenticatedSubject.next(true)),
			// tap((res) => {
			// 	this.cookie.set('session_user', res.data.username);
			// 	this.cookie.set('session_role', res.data.role);
			// }),
			();
	}

	// Check if user is authenticated by checking the presence of the session cookie
	hasSession(): boolean {}

	// Logout method that deletes the session cookie
	logout(): Observable<{ message: string }> {
		return this.httpClient.post<{ message: string }>(`${this.host}/auth/logout`, {}).pipe(
			// tap(() => this.isAuthenticatedSubject.next(false)),
			// tap(() => this.dataSubject.next({ username: '', role: '' })),
			tap(() => {
				this.cookie.deleteAll();
			}),
			tap(() => this.router.navigate(['/login'])),
		);
	}

	// Optionally, get the session token (if needed elsewhere)
	getSession() {
		return this.httpClient.get<UserData>(`${this.host}/auth/check`).pipe(
			tap((data) => this.dataSubject.next(data)),
			tap(() => this.isAuthenticatedSubject.next(true)),
			tap((data) => {
				this.cookie.set('session_user', data.username);
				this.cookie.set('session_role', data.role);
			}),
		);
	}
}
