import {
	ApplicationConfig,
	DEFAULT_CURRENCY_CODE,
	inject,
	isDevMode,
	LOCALE_ID,
	provideAppInitializer,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HOST } from '@orda.core/config/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '@orda.core/interceptors/error.interceptor';
import { credentialInterceptor } from '@orda.core/interceptors/credential.interceptor';
import localeDe from '@angular/common/locales/de';
import { SessionService } from '@orda.core/services/session.service';

registerLocaleData(localeDe, 'de');

export const appConfig: ApplicationConfig = {
	providers: [
		provideAppInitializer(() => {
			inject(SessionService);
		}),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withHashLocation()),
		provideAnimationsAsync(),
		provideHttpClient(withInterceptors([errorInterceptor, credentialInterceptor])),
		{
			provide: HOST,
			useValue: isDevMode() ? 'http://localhost:3000' : location.origin,
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
