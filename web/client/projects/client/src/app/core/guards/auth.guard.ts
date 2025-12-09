import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '@orda.core/services/session.service';

export const authGuard: CanActivateFn = () => {
  if (inject(SessionService).isAuthenticated()) {
    return true;
  }
  return inject(Router).navigate(['/login']);
};
