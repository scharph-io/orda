import { inject, Injectable } from '@angular/core';
import { Account } from '@orda.core/models/account';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@orda.core/constants';
import { HttpClient } from '@angular/common/http';
import { HOST } from '@orda.core/config/config';

export interface DepositRequest {
	amount: number;
	userid: string;
	transactionid?: string;
	history_type: number;
	deposit_type: number;
}

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	// override entityResource = rxResource(""
	// 	loader: () => this.readById(this.accountId),
	// });

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

	deposit(id: string, deposit: DepositRequest): Observable<Account> {
		return this.httpClient.post<Account>(
			`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}/deposit`,
			deposit,
		);
	}
}
