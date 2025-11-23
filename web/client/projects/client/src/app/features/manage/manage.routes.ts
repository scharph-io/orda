import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./manage.component').then((m) => m.ManageComponent),
	},
	// {
	// 	path: 'roles',
	// 	loadComponent: () => import('./roles/roles.component').then((m) => m.RolesComponent),
	// },
	{
		path: 'users',
		loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent),
	},
	{
		path: 'views',
		loadChildren: () => import('./views/view.routes'),
	},
	{
		path: 'history',
		loadComponent: () => import('./history/history.component').then((m) => m.HistoryComponent),
	},
	{
		path: 'assortment',
		loadChildren: () => import('./assortment/assortment.routes'),
	},
	{
		path: 'accounts',
		loadChildren: () => import('./account/account.routes'),
	},
] satisfies Routes;
