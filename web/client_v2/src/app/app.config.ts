import {
  ApplicationConfig,
  isDevMode,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { URL_TOKEN } from '../../projects/shared/src/public-api';

import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withDebugTracing()),
    provideAnimationsAsync(),
    {
      provide: URL_TOKEN,
      useValue: `${
        !isDevMode() ? location.origin : 'http://localhost:3000'
      }/api/v1`,
    },
    {
      provide: LOCALE_ID,
      useValue: 'de',
    },
  ],
};
