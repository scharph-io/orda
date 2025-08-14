import { inject, Injectable } from '@angular/core';
import { Account } from '@orda.core/models/account';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@orda.core/constants';
import { HttpClient } from '@angular/common/http';
import { HOST } from '@orda.core/config/config';

export interface AccDepositRequest {
	amount: number;
	transaction_id?: string;
	history_action: number;
	deposit_type: number;
	reason: string;
}

export interface AccDepositManyRequest extends AccDepositRequest {
	account_ids: string[];
}

export interface AccCorrectionRequest {
	new_balance: number;
	reason: string;
}

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	httpClient = inject(HttpClient);
	HOST = inject(HOST);

	create(t: Partial<Account>): Observable<Account> {
		return this.httpClient.post<Account>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}`, t);
	}

	delete(id: string): Observable<unknown> {
		return this.httpClient.delete(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}`);
	}

	read(): Observable<Account[]> {
		return this.httpClient.get<Account[]>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}`);
	}

	readById(id: string): Observable<Account> {
		return this.httpClient.get<Account>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}`);
	}

	readByGroupId(id: string): Observable<Account[]> {
		return this.httpClient.get<Account[]>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/group/${id}`);
	}

	update(id: string, t: Partial<Account>): Observable<Account> {
		return this.httpClient.put<Account>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}`, t);
	}

	deposit(id: string, deposit: AccDepositRequest): Observable<Account> {
		return this.httpClient.post<Account>(
			`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}/deposit`,
			deposit,
		);
	}

	depositMany(deposit: AccDepositManyRequest) {
		return this.httpClient.post<{ message: string }>(
			`${this.HOST}${API_ENDPOINTS.ACCOUNT}/deposit`,
			deposit,
		);
	}

	correct(id: string, correction: AccCorrectionRequest): Observable<Account> {
		return this.httpClient.post<Account>(
			`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}/correct`,
			correction,
		);
	}
}
