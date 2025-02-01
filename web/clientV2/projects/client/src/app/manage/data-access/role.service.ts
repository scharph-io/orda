import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { URL_TOKEN } from '@shared/utils/token';
import { Role } from '@shared/utils/types';

@Injectable({ providedIn: 'root' })
export class RoleService {
	private url = inject(URL_TOKEN);

	constructor() {
		console.log('RoleService created with URL:', this.url);
	}

	getRoles(): Observable<Role[]> {
		return of([
			{ id: 0, name: 'admin' },
			{ id: 1, name: 'kellner1' },
			{ id: 2, name: 'kellner2' },
			{ id: 3, name: 'essen1' },
			{ id: 4, name: 'essen2' },
			{ id: 5, name: 'bar1' },
			{ id: 6, name: 'bar2' },
		]);
	}
}
