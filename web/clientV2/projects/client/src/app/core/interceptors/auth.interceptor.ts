import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const token = inject(CookieService).get('session_id');
	if (token) {
		// Clone the request to add the Authorization header with the token
		const clonedRequest = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
		return next(clonedRequest); // Proceed with the cloned request
	}

	return next(req);
};
