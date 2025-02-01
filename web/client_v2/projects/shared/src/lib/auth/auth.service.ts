import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSubject: Subject<string>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<string>('user');
  }
  get currentUser() {
    return this.currentUserSubject.asObservable();
  }
}
