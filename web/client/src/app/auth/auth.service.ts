import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

export interface Claims {
  name: string;
  token: string;
  admin: boolean;
  exp: number;
}

const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  authState$ = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    public router: Router,
    @Inject('ENDPOINT') private endpoint: string,
  ) {
    this.authState$.next(this.authenticated);
  }
  // Sign-in
  auth(username: string, password: string) {
    const formData = new FormData();
    formData.append('identity', username);
    formData.append('password', password);
    return this.http
      .post<{ token: string }>(`${this.endpoint}/api/auth/login`, formData)
      .pipe(catchError(this.handleError));
  }

  forwardToHome() {
    this.authState$.next(true);
    this.router.navigate(['home']);
  }

  setToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
  }

  get authenticated(): boolean {
    return localStorage.getItem(ACCESS_TOKEN_KEY) != null && !this.isExpired();
  }

  logout() {
    const removeToken = localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.authState$.next(false);

    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  isAdmin(): boolean {
    return jwtDecode<Claims>(this.getToken()).admin;
  }

  get username(): string {
    return jwtDecode<Claims>(this.getToken()).name;
  }

  isExpired(): boolean {
    return jwtDecode<Claims>(this.getToken()).exp < Date.now() / 1000;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else if (error.status === 401) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      return throwError(() => new Error('Invalid username or password'));
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () =>
        new Error(
          `Login failed, try again later ${error.status === 0 ? '' : ` (ERR${error.status})`}`,
        ),
    );
  }
}
