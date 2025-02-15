import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./assortment.component').then((m) => m.AssortmentComponent),
	},
	{
		path: ':id',
		loadComponent: () =>
			import('./products/products.component').then((m) => m.AssortmentProductsComponent),
	},
] satisfies Routes;
