// http://localhost:8080/api/statistic/day

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

export interface Statistics {
  date?: string;
  total: number;
  deposit: {
    deposit_in: number;
    deposit_out: number;
  };
  payment_option: number[];
  account_type: number[];
}

export type ProductStatistics = ProductStatisitic[];
export interface ProductStatisitic {
  product_id: string;
  qty: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) {
    this.endpoint = `${this.endpoint}/api/statistic`;
  }

  getStatistics$() {
    return this.http.get<Statistics>(`${this.endpoint}`);
  }

  getStatisticsforDate$(date: string) {
    return this.http.get<Statistics>(`${this.endpoint}?date=${date}`);
  }

  getProductStatistics$() {
    return this.http.get<ProductStatistics>(`${this.endpoint}/products`);
  }

  getProductStatisticsforDate$(date: string) {
    return this.http.get<ProductStatistics>(
      `${this.endpoint}/products?date=${date}`,
    );
  }
}
