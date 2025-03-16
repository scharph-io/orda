import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@orda.core/services/auth.service';

export const roleGuard: CanActivateFn = () => {
	if (inject(AuthService).user().role == 'admin') {
		return true;
	} else {
		inject(Router)
			.navigate(['/order'])
			.then(() => {
				return;
			});
		return false;
	}
};
