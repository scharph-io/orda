import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '@orda.core/services/session.service';

export const manageGuard: CanActivateFn = () => {
	if (inject(SessionService).user().role == 'admin') {
		return true;
	}
	return inject(Router).navigate(['/order']);
};
