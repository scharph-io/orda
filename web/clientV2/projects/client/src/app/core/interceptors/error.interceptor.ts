import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '@orda.core/services/session.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		catchError((error) => {
			// console.log('test');
			inject(SessionService).logout();
			// if (error instanceof HttpErrorResponse && error.status === 401) {
			// } else if (error instanceof HttpErrorResponse) {
			console.log(
				'HTTP ERROR',
				(error as HttpErrorResponse).status,
				(error as HttpErrorResponse).statusText,
			);
			// }
			//
			return throwError(() => error);
		}),
	);
};
