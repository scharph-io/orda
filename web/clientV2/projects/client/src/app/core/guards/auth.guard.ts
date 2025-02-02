import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
	// const authService = inject(AuthService);
	const router = inject(Router);

	return router.parseUrl('auth/login');
};
