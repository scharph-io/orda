import { InjectionToken } from '@angular/core';

export interface Host {
	domain: string;
	port?: number;
	path: string;
}

export const API = new InjectionToken<string>('API Information');
export const HOST = new InjectionToken<string>('Host Information');

export const DEV_HOST: Host = {
	domain: 'http://localhost',
	port: 3000,
	path: 'api/v1',
};

export const PROD_HOST: Host = {
	domain: location.origin,
	path: 'api/v1',
};

export function toUrl(host: Host) {
	if (host.port) {
		return `${host.domain}:${host.port}`;
	}
	return `${host.domain}`;
}
