import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { HOST } from '@orda.core/config/config';
import { API_ENDPOINTS } from '@orda.core/constants';
import { Transaction, TransactionSummary } from '@orda.core/models/transaction';

@Injectable({
	providedIn: 'root',
})
export class TransactionService {
	httpClient = inject(HttpClient);
	HOST = inject(HOST);
	logger = inject(OrdaLogger);

	public getTransactionsByDate(date?: string) {
		if (date) {
			date = new Intl.DateTimeFormat('en-CA', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}).format(Date.parse(date));
		}
		return this.httpClient.get<Transaction[]>(
			`${this.HOST}${API_ENDPOINTS.TRANSACTION}${date ? `?date=${date}` : ''}`,
		);
	}

	public getSummaryByDate(date?: string) {
		if (date) {
			date = new Intl.DateTimeFormat('en-CA', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}).format(Date.parse(date));
		}

		return this.httpClient.get<TransactionSummary>(
			`${this.HOST}${API_ENDPOINTS.TRANSACTION}/summarybydate${date ? `?date=${date}` : ''}`,
		);
	}
}
