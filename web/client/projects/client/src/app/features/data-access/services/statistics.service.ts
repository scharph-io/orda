import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { HOST } from '@orda.core/config/config';
import { API_ENDPOINTS } from '@orda.core/constants';
import { map } from 'rxjs';
import { formatISOWithOffset } from '@orda.shared/utils/helper';

export interface ProductQuantitiesResponse {
	dates: string[];
	datasets: {
		product_id: string;
		dataset: number[];
	}[];
	from: Date;
	to: Date;
}

export interface TransactionQuantities {
	year: number;
	data: {
		date: Date;
		qty: number;
	};
}

export interface PaymentStats {
	payment_option: number;
	transactions: number;
	total_amount: number;
	total_credit_amount: number;
}

export type PaymentOptionsMap = Record<number, PaymentStats | undefined>

export interface PaymentOptionsStatResponse {
	data: PaymentOptionsMap | null;
	from: Date;
	to: Date;
}

@Injectable({
	providedIn: 'root',
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
			},
		});
		return this.httpClient.get<ProductQuantitiesResponse>(
			`${this.HOST}${API_ENDPOINTS.STATISTICS}/products/${productId}/qty`,
			{
				params,
			},
		);
	}

	public getProductsQuantitiesDataset(productIds: string[], from?: Date, to?: Date) {
		const params = new HttpParams({
			fromObject: {
				...(from ? { from: from.toUTCString() } : {}),
				...(to ? { to: to.toUTCString() } : {}),
				ids: productIds.join(','),
			},
		});
		return this.httpClient.get<ProductQuantitiesResponse>(
			`${this.HOST}${API_ENDPOINTS.STATISTICS}/products/qty`,
			{
				params,
			},
		);
	}

	public getTransactionsDates(from?: Date, to?: Date) {
		const params = new HttpParams({
			fromObject: {
				...(from ? { from: from.toUTCString() } : {}),
				...(to ? { to: to.toUTCString() } : {}),
			},
		});
		return this.httpClient
			.get<string[]>(`${this.HOST}${API_ENDPOINTS.STATISTICS}/transactions/dates`, {
				params,
			})
			.pipe(map((dates) => dates.map((d) => new Date(d))));
	}

	public getTransactionsQuantities(from?: Date, to?: Date) {
		const params = new HttpParams({
			fromObject: {
				...(from ? { from: from.toUTCString() } : {}),
				...(to ? { to: to.toUTCString() } : {}),
			},
		});
		return this.httpClient.get<TransactionQuantities>(
			`${this.HOST}${API_ENDPOINTS.STATISTICS}/transactions/qty`,
			{
				params,
			},
		);
	}

	public getPaymentOptions(from?: Date, to?: Date) {
		const params = new HttpParams({
			fromObject: {
				...(from ? { from: formatISOWithOffset(from) } : {}),
				...(to ? { to: formatISOWithOffset(to) } : {}),
			},
		});
		return this.httpClient.get<PaymentOptionsStatResponse>(
			`${this.HOST}${API_ENDPOINTS.STATISTICS}/paymentoptions`,
			{
				params,
			},
		);
	}
}
