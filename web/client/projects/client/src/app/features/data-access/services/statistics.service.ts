import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { HOST } from '@orda.core/config/config';
import { API_ENDPOINTS } from '@orda.core/constants';

export interface ProductQuantitiesResponse {
	data: {
		reporting_day: Date
		total_qty: number
	}[],
	from: Date,
	to: Date,
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
	httpClient = inject(HttpClient);
	HOST = inject(HOST);
	logger = inject(OrdaLogger);

	public getProductQuantitiesByDateRange(productId: string, from?: Date, to?: Date) {
		const params = new HttpParams();
		if(from) {
			params.set('from', from.toUTCString())
		}
		if(to) {
			params.set('to', to.toUTCString());
		}
		return this.httpClient.get<ProductQuantitiesResponse>(
			`${this.HOST}${API_ENDPOINTS.STATISTICS}/products/${productId}/qty`,
			{
				params
			}
		)
	}
}
