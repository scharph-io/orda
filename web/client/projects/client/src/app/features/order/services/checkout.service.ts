import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { PaymentOption } from '../utils/transaction';
import { HOST } from '@orda.core/config/config';
import { API_ENDPOINTS } from '@orda.core/constants';

export interface CheckoutRequestItem {
	id: string;
	quantity: number;
}

export interface CheckoutRequest {
	items: CheckoutRequestItem[];
	payment_option: PaymentOption;
	account_id?: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
	httpClient = inject(HttpClient);
	HOST = inject(HOST);

	checkout(checkoutReq: CheckoutRequest) {
		return this.httpClient
			.post<{
				success: boolean;
			}>(`${this.HOST}${API_ENDPOINTS.ORDER}/checkout`, checkoutReq)
			.pipe(catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error);
		} else if (error.status === 401) {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong.
			return throwError(() => new Error('Invalid username or password'));
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong.
			console.error(`Backend returned code ${error.status}, body was: `, error.error);
		}
		// Return an observable with a user-facing error message.
		return throwError(
			() => new Error(`Checkout failed ${error.status === 0 ? '' : ` (ERR${error.status})`}`),
		);
	}
}
