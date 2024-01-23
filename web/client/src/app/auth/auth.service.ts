import { Injectable } from '@angular/core';
// import { User } from './user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

interface Claims {
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
  endpoint: string = 'http://10.0.0.20:8080/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  authState$ = new BehaviorSubject(false);

  constructor(private http: HttpClient, public router: Router) {
    this.authState$.next(this.authenticated);
  }
  // Sign-in
  auth(username: string, password: string) {
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return this.http
      .post<Claims>(`${this.endpoint}/auth`, formData)
      .subscribe((res: Claims) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
        this.authState$.next(true);
        this.router.navigate(['home']);
      });
  }

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
  }

  get authenticated(): boolean {
    return localStorage.getItem(ACCESS_TOKEN_KEY) != null;
  }

  logout() {
    let removeToken = localStorage.removeItem(ACCESS_TOKEN_KEY);
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
}
