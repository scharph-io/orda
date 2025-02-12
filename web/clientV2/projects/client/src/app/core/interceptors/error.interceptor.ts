import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
// import { AuthService } from '@core/services/auth.service';
import { catchError, EMPTY, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router);

	return next(req).pipe(
		catchError((error) => {
			if (error instanceof HttpErrorResponse && error.status === 401) {
				router.navigate(['/login']).catch((err) => console.error(err));
				return EMPTY;
			} else if (error instanceof HttpErrorResponse) {
				console.log(
					'HTTP ERROR',
					(error as HttpErrorResponse).status,
					(error as HttpErrorResponse).statusText,
				);
			}

			return throwError(() => error);
		}),
	);
};
