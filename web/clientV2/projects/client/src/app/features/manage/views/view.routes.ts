import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./views.component').then((c) => c.ViewsComponent),
	},
	{
		path: ':id',
		loadComponent: () =>
			import('./products/view-products.component').then((m) => m.ViewProductsComponent),
	},
] satisfies Routes;
