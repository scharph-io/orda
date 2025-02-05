import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = () => {
	const authService = inject(AuthService);
	const router = inject(Router);
	if (!authService.isAuthenticated()) {
		router.navigate(['login']);
		return false;
	}
	return true;
};
