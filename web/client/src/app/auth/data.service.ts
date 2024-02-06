import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  getRestrictedInfo$() {
    return this.http.get<string>('http://localhost:8080/restricted');
  }
}
