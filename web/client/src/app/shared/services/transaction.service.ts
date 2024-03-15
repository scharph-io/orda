import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Transaction } from '../model/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) {}

  getTransactions$() {
    return this.http.get<Transaction[]>(`${this.endpoint}/api/transaction`);
  }
  getTransactionsLast2Days$() {
    return this.http.get<Transaction[]>(
      `${this.endpoint}/api/transaction/last2Days`,
    );
  }

  //   getTransaction(id: string) {
  //     return this.http.get<Transaction>(`${this.endpoint}/api/transaction/${id}`);
  //   }

  //   updateTransaction(id: string, Transaction: Transaction) {
  //     return this.http.put<Transaction>(
  //       `${this.endpoint}/api/category/${id}`,
  //       Transaction,
  //       { headers: this.headers },
  //     );
  //   }

  deleteTransaction(id: string) {
    return this.http.delete<Transaction>(`${this.endpoint}/api/category/${id}`);
  }
}
