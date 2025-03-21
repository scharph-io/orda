import { computed, inject, Injectable, signal } from '@angular/core';
import { HOST } from '@orda.core/config/config';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, SessionInfo } from '@orda.core/models/login-response';
import { tap } from 'rxjs';
import { OrdaLogger } from '@orda.shared/services/logger.service';

@Injectable({
	providedIn: 'root',
})
export class SessionService {
	private readonly host = inject<string>(HOST);
	private readonly httpClient = inject(HttpClient);
	private readonly logger = inject(OrdaLogger);

	user = signal<SessionInfo>({});

	isAuthenticated = computed(() => !!this.user().username);

	constructor() {
		this.logger.debug('Init SessionService');
		if(localStorage.getItem('user')) {
      this.checkSession().subscribe({
        next: (res) => {
          this.user.set(res);
          localStorage.setItem('user', JSON.stringify(res));
          this.logger.debug('SessionService restored');
        },
        error: (err) => {
          this.logger.error(err);
          this.logout()
        }
      })
    }
	}

	checkSession() {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			this.user.set(JSON.parse(storedUser));
		}
		return this.httpClient.get<SessionInfo>(`${this.host}/auth/session`);
	}

	public logout() {
		this.logger.debug('logout');
		localStorage.removeItem('user');
		this.user.set({});
		return this.httpClient.post<void>(`${this.host}/auth/logout`, {}).pipe(
			tap(() => {
				this.logger.debug('logout success');
			}),
		);
	}

	public login(username: string, password: string) {
		this.logger.debug('login');
		return this.httpClient
			.post<LoginResponse<SessionInfo>>(`${this.host}/auth/login`, {
				username,
				password,
			})
			.pipe(
				tap((res) => {
					this.logger.debug('login success');
					this.user.set(res.data);
					localStorage.setItem('user', JSON.stringify(res.data));
				}),
			);
	}
}
