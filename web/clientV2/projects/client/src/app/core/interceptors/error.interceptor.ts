import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { catchError, EMPTY, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router);
	const authService = inject(AuthService);

	return next(req).pipe(
		catchError((error) => {
			if (error instanceof HttpErrorResponse && error.status === 401) {
				authService.logout();
				router.navigate(['login']).catch((err) => console.error(err));
				console.log('Error interceptor');
				return EMPTY;
			}

			return throwError(() => error);
		}),
	);
};
