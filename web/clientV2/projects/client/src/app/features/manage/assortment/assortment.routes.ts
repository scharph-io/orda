import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./assortment.component').then((a) => a.AssortmentComponent),
	},
	{
		path: ':id',
		loadComponent: () =>
			import('./products/products.component').then((m) => m.AssortmentProductsComponent),
	},
] satisfies Routes;
