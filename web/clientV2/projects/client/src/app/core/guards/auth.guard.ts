import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@orda.core/services/auth.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (_route, _state) => {
	if (inject(AuthService).isAuthenticated()) {
		return true;
	}
	inject(Router).navigate(['/login']);
	return false;
};
