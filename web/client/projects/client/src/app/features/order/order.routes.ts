import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./order.component').then((c) => c.OrderComponent),
	},
	{
		path: 'view/:id',
		loadComponent: () => import('./views/views.component').then((c) => c.ViewsComponent),
	},
] satisfies Routes;
