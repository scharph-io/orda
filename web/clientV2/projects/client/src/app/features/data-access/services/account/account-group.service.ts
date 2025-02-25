import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@orda.core/constants';
import { AccountGroup } from '@orda.core/models/account';
import { EntityService } from '@orda.shared/utils/entity-service';
import { catchError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AccountGroupService extends EntityService<AccountGroup> {
	create(t: Partial<AccountGroup>) {
		return this.httpClient
			.post<AccountGroup>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/group`, t)
			.pipe(catchError(this.handleError));
	}

	read() {
		return this.httpClient
			.get<AccountGroup[]>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/group`)
			.pipe(catchError(this.handleError));
	}

	readById(id: string) {
		return this.httpClient
			.get<AccountGroup>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/group/${id}`)
			.pipe(catchError(this.handleError));
	}

	delete(id: string) {
		return this.httpClient
			.delete(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/group/${id}`)
			.pipe(catchError(this.handleError));
	}

	update(id: string, t: Partial<AccountGroup>) {
		return this.httpClient
			.put<AccountGroup>(`${this.HOST}${API_ENDPOINTS.ACCOUNT}/group/${id}`, t)
			.pipe(catchError(this.handleError));
	}
}
