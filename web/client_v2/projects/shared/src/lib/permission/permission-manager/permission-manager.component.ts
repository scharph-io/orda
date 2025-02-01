import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { PolicyDTO, PolicySyncService } from '../../policy/policy-sync.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-policy-manager',
  imports: [AsyncPipe],
  providers: [PolicySyncService],
  template: `
    <!-- <div *ngIf="isAdmin"> -->
    <h2>Policy Management</h2>
    <table>
      @for (policy of policies$ | async; track $index) {
      <tr>
        <td>{{ policy.role }}</td>
        <td>{{ policy.resource }}</td>
        <td>{{ policy.action }}</td>
      </tr>
      }
    </table>
    <button (click)="updatePolicies()">Sync Policies</button>
    <!-- </div> -->
  `,
})
export class PolicyManagerComponent implements OnInit {
  policies$?: Observable<PolicyDTO[]>;
  isAdmin: boolean = false;

  constructor(
    private policyService: PolicySyncService // private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if current user is admin
    // this.isAdmin = this.authService.getCurrentUserRole() === 'admin';

    // Subscribe to policies
    this.policies$ = this.policyService.policies$;
  }

  updatePolicies() {
    const newPolicies: PolicyDTO[] = [
      // Example policy updates
      { role: 'admin', resource: 'dashboard', action: 'view', effect: 'allow' },
      { role: 'editor', resource: 'users', action: 'create', effect: 'allow' },
    ];

    // this.policyService.updatePolicies(newPolicies).subscribe({
    //   next: () => {
    //     console.log('Policies updated successfully');
    //   },
    //   error: (err) => {
    //     console.error('Failed to update policies', err);
    //   },
    // });
  }
}
