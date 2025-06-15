import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@orda.core/constants';
import { HttpClient } from '@angular/common/http';
import { HOST } from '@orda.core/config/config';

export interface AccountHistoryResponse {
	id: string;
	amount: string;
	deposit_type: number;
	history_type: number;
	comment: string;
	created_at: string;
}

@Injectable({
	providedIn: 'root',
})
export class AccountHistoryService {
	httpClient = inject(HttpClient);
	HOST = inject(HOST);

	read(accountId: string) {
		return this.httpClient.get<AccountHistoryResponse[]>(
			`${this.HOST}${API_ENDPOINTS.ACCOUNT_HISTORY}?account=${accountId}`,
		);
	}
}
