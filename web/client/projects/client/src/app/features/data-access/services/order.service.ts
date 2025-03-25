import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { View, ViewProduct } from '@orda.core/models/view';
import { API_ENDPOINTS } from '@orda.core/constants';
import { HOST } from '@orda.core/config/config';

@Injectable({
	providedIn: 'root',
})
export class OrderService {
	httpClient = inject(HttpClient);
	HOST = inject(HOST);
	logger = inject(OrdaLogger);

	public views = rxResource({
		loader: () => this.getViews(),
	});

	public getViews() {
		return this.httpClient.get<Partial<View>[]>(`${this.HOST}${API_ENDPOINTS.ORDER}/views`);
	}

  public getViewProducts(viewId: string) {
    return this.httpClient.get<Map<string, Partial<ViewProduct>[]>>(`${this.HOST}${API_ENDPOINTS.ORDER}/views/${viewId}`);
  }
}
