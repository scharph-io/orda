import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.log(
        'HTTP ERROR',
        (error as HttpErrorResponse).status,
        (error as HttpErrorResponse).message,
      );
      return throwError(() => error);
    }),
  );
};
