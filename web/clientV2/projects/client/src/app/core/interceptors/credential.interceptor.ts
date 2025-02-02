import { HttpInterceptorFn } from '@angular/common/http';

export const credentialInterceptor: HttpInterceptorFn = (req, next) => {
	const newReq = req.clone({
		withCredentials: true,
	});

	return next(newReq);
};
