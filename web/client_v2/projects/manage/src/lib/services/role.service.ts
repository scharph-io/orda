import { inject, Injectable } from '@angular/core';
import { URL_TOKEN } from '../../../../shared/src/public-api';
import { Observable, of } from 'rxjs';
import { Role } from '../roles/roles.component';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private url = inject(URL_TOKEN);

  constructor() {
    console.log('RoleService created with URL:', this.url);
  }

  getRoles(): Observable<Role[]> {
    return of([
      { id: 0, name: 'admin' },
      { id: 1, name: 'user' },
    ]);
  }
}
