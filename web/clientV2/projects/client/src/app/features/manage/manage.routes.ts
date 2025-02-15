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
	{
		path: 'users',
		loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent),
	},
	{
		path: 'views',
		loadComponent: () => import('./views/views.component').then((m) => m.ViewsComponent),
	},
	{
		path: 'assortment',
		loadChildren: () => import('./assortment/assortment.routes'),
	},
] satisfies Routes;
