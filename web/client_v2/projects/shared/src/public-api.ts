/*
 * Public API Surface of shared
 */

import { InjectionToken } from '@angular/core';

export * from './lib/shared.service';
export * from './lib/shared.component';
export * from './lib/login/login.component';
export * from './lib/auth/auth.service';
export * from './lib/permission/permission-manager/permission-manager.component';

export const URL_TOKEN = new InjectionToken<string>('URL');
