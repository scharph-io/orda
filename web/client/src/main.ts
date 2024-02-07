import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { VERSION as CDK_VERSION } from '@angular/cdk';
import { VERSION as MAT_VERSION } from '@angular/material/core';
import { VERSION as ORDA_VERSION } from './core/version';

import { isDevMode } from '@angular/core';

/* eslint-disable no-console */
if (isDevMode()) {
  console.info('Angular CDK version', CDK_VERSION.full);
  console.info('Angular Material version', MAT_VERSION.full);
}
console.info('Orda version', ORDA_VERSION);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
