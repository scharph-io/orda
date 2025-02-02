import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./manage.component').then((m) => m.ManageComponent),
	},
	{
		path: 'roles',
		loadComponent: () => import('./roles/roles.component').then((m) => m.RolesComponent),
	},
] satisfies Routes;
