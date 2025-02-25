import { Routes } from '@angular/router';

export default [
	// {
	// 	path: '',
	// 	loadComponent: () => import('./account-group.component').then((m) => m.AccountGroupComponent),
	// },
	{
		path: '',
		loadComponent: () => import('./account.component').then((m) => m.AccountComponent),
	},
] satisfies Routes;
