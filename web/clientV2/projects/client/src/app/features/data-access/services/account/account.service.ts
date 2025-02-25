import { Injectable } from '@angular/core';
import { EntityService } from '@orda.shared/utils/entity-service';
import { Account } from '@orda.core/models/account';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_ENDPOINTS } from '@orda.core/constants';

@Injectable({
	providedIn: 'root',
})
export class AccountService extends EntityService<Account> {
	// override entityResource = rxResource(""
	// 	loader: () => this.readById(this.accountId),
	// });

	create(t: Partial<Account>): Observable<Account> {
		return this.httpClient
			.post<Account>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}`, t)
			.pipe(catchError(this.handleError));
	}

	delete(id: string): Observable<unknown> {
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}`)
			.pipe(catchError(this.handleError));
	}

	read(): Observable<Account[]> {
		return this.httpClient
			.get<Account[]>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}`)
			.pipe(catchError(this.handleError));
	}

	readById(id: string): Observable<Account> {
		return this.httpClient
			.get<Account>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}`)
			.pipe(catchError(this.handleError));
	}

	readByGroupId(id: string): Observable<Account[]> {
		return this.httpClient
			.get<Account[]>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/group/${id}`)
			.pipe(catchError(this.handleError));
	}

	update(id: string, t: Partial<Account>): Observable<Account> {
		return this.httpClient
			.put<Account>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/${id}`, t)
			.pipe(catchError(this.handleError));
	}
}
