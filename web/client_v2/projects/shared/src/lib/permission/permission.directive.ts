import {
  Directive,
  Input,
  ElementRef,
  viewChild,
  input,
  contentChild,
  AfterContentChecked,
  AfterViewChecked,
  OnInit,
  effect,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { PolicyDTO, PolicySyncService } from '../policy/policy-sync.service';
import { MatButton } from '@angular/material/button';
import { filter, pipe, switchMap } from 'rxjs';

type PolicyReq = Pick<PolicyDTO, 'resource' | 'action'>;

// Directive for permission-based element visibility
@Directive({
  selector: '[appPermission]',
})
export class PermissionDirective implements OnInit {
  appPermission = input.required<PolicyReq>();
  policyService = inject(PolicySyncService);
  authService = inject(AuthService);
  ele = inject(ElementRef<MatButton>);

  ngOnInit(): void {
    // Hide the element by default
    this.ele.nativeElement.style.display = 'none';
    this.authService.currentUser
      .pipe(
        switchMap((userRole) =>
          this.policyService
            .hasPermission(
              userRole,
              this.appPermission().resource,
              this.appPermission().action
            )
            .pipe(filter((hasPermission) => hasPermission))
        )
      )
      .subscribe((_) => {
        // Show the element if the user has the required permission
        this.ele.nativeElement.style.display = 'inline';
      });
  }
}
