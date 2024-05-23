import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import {
  DATE_PIPE_DEFAULT_OPTIONS,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { MAT_DATE_LOCALE } from '@angular/material/core';
registerLocaleData(localeDe, 'de');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem('access_token');
          },
          allowedDomains: ['localhost:8080'],
          disallowedRoutes: ['localhost:8080/api/auth'],
        },
      }),
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'de',
        fallbackLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: false,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: 'ENDPOINT',
      useValue: isDevMode() ? 'http://localhost:8080' : '',
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
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
