import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Policy Data Transfer Object
export interface PolicyDTO {
  role: string;
  resource: string;
  action: string;
  effect: string;
}

@Injectable({
  providedIn: 'root',
})
export class PolicySyncService {
  // Local policy cache
  private policiesSubject = new BehaviorSubject<PolicyDTO[]>([]);
  public policies$ = this.policiesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initial policy fetch on service initialization
    this.fetchPolicies().subscribe((p) => this.policiesSubject.next(p)); // Subscribe to fetchPolicies
  }

  // Fetch current policies from backend
  fetchPolicies(): Observable<PolicyDTO[]> {
    const role = 'user';
    return this.http.get<PolicyDTO[]>(
      `http://localhost:3000/api/policies/${role}`
    );
  }

  // // Update policies (admin-only)
  // updatePolicies(policies: PolicyDTO[]): Observable<any> {
  //   return this.http.put('http://localhost:3000/api/policies', policies).pipe(
  //     tap(() => {
  //       // Update local cache after successful backend update
  //       this.policiesSubject.next(policies);
  //     })
  //   );
  // }

  hasPermission(role: string, resource: string, action: string) {
    return this.policiesSubject
      .asObservable()
      .pipe(
        map((policies) =>
          policies.some(
            (p) =>
              p.role === role && p.resource === resource && p.action === action
          )
        )
      );
  }

  // Get permissions for a specific role
  getRolePermissions(role: string): PolicyDTO[] {
    return this.policiesSubject.value.filter((policy) => policy.role === role);
  }
}
