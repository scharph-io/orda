// http://localhost:8080/api/statistic/day

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

export interface Statistics {
  total: string;
  paymentOptions: number[];
  deposit: {
    deposit_in: number;
    deposit_out: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) {}

  getStatistics$() {
    return this.http.get<Statistics>(`${this.endpoint}/api/statistic/day`);
  }
}
