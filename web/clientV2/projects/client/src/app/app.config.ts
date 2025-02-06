import {
	ApplicationConfig,
	DEFAULT_CURRENCY_CODE,
	isDevMode,
	LOCALE_ID,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { API, DEV_HOST, HOST, PROD_HOST, toUrl } from '@core/config/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { credentialInterceptor } from '@core/interceptors/credential.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withHashLocation()),
		provideAnimationsAsync(),
		provideHttpClient(withInterceptors([errorInterceptor, credentialInterceptor])),
		{
			provide: API,
			useValue: isDevMode()
				? `${toUrl(DEV_HOST)}/${DEV_HOST.path}`
				: `${toUrl(PROD_HOST)}/${PROD_HOST.path}`,
		},
		{
			provide: HOST,
			useValue: isDevMode() ? toUrl(DEV_HOST) : toUrl(DEV_HOST),
		},
		{
			provide: LOCALE_ID,
			useValue: 'de',
		},
		{ provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
		{
			provide: DATE_PIPE_DEFAULT_OPTIONS,
			useValue: { dateFormat: 'shortDate' },
		},
		{ provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
	],
};
