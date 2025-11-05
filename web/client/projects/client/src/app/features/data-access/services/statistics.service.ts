import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { HOST } from '@orda.core/config/config';
import { API_ENDPOINTS } from '@orda.core/constants';
import { map } from 'rxjs';

export interface ProductQuantitiesResponse {
	dates: string[],
	datasets: {
		product_id: string,
		dataset: number[]
	}[],
	from: Date,
	to: Date,
}

export interface TransactionQuantities {
	year: number;
	data: {
		date: Date,
		qty: number,
	}
}

@Injectable({
	providedIn: 'root'
})
export class StatisticsService {
	httpClient = inject(HttpClient);
	HOST = inject(HOST);
	logger = inject(OrdaLogger);

	public getProductQuantitiesByDateRange(productId: string, from?: Date, to?: Date) {
		const params = new HttpParams({
			fromObject: {
				...(from ? { from: from.toUTCString() } : {}),
				...(to ? { to: to.toUTCString() } : {}),
			}

		});
		return this.httpClient.get<ProductQuantitiesResponse>(
			`${this.HOST}${API_ENDPOINTS.STATISTICS}/products/${productId}/qty`,
			{
				params
			}
		)
	}

	public getProductsQuantitiesDataset(productIds: string[], from?: Date, to?: Date) {
		const params = new HttpParams({
			fromObject: {
				...(from ? { from: from.toUTCString() } : {}),
				...(to ? { to: to.toUTCString() } : {}),
				ids: productIds.join(','),
			}

		});
		return this.httpClient.get<ProductQuantitiesResponse>(
			`${this.HOST}${API_ENDPOINTS.STATISTICS}/products/qty`,
			{
				params
			}
		)
	}

	public getTransactionsDates(from?: Date, to?: Date) {
		const params = new HttpParams({
			fromObject: {
				...(from ? { from: from.toUTCString() } : {}),
				...(to ? { to: to.toUTCString() } : {}),
			}

		});
		return this.httpClient.get<string[]>(`${this.HOST}${API_ENDPOINTS.STATISTICS}/transactions/dates`, {
			params
		}).pipe(map(dates => dates.map(d => new Date(d))))
	}

	public getTransactionsQuantities(from?: Date, to?: Date) {
		const params = new HttpParams({
			fromObject: {
				...(from ? { from: from.toUTCString() } : {}),
				...(to ? { to: to.toUTCString() } : {}),
			}

		});
		return this.httpClient.get<TransactionQuantities>(`${this.HOST}${API_ENDPOINTS.STATISTICS}/transactions/qty`, {
			params
		})
	}
}
