import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./account.component').then((m) => m.AccountComponent),
	},
	// {
	//   path: ':id',
	//   loadComponent: () =>
	//     import('./products/products.component').then((m) => m.AssortmentProductsComponent),
	// },
] satisfies Routes;
