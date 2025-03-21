import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {


  return next(req).pipe(
		catchError((error) => {
			// console.log('test');
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
