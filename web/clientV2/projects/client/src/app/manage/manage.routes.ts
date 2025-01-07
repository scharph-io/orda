import { Route } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () =>
			import('@manage/feature/home/home.component').then((m) => m.ManageComponent),
	},
	{
		path: 'assortment',
		loadComponent: () =>
			import('@manage/feature//assortment/assortment.component').then((m) => m.AssortmentComponent),
		children: [
			{
				path: 'products',
				loadComponent: () =>
					import('@manage/feature//products/products.component').then((m) => m.ProductsComponent),
			},
			{
				path: 'groups',
				loadComponent: () =>
					import('@manage/feature//groups/groups.component').then((m) => m.GroupsComponent),
			},
		],
	},
	{
		path: 'roles',
		loadComponent: () =>
			import('@manage/feature//roles/roles.component').then((m) => m.RolesComponent),
	},
	{
		path: 'accounts',
		loadComponent: () =>
			import('@manage/feature//accounts/accounts.component').then((m) => m.AccountsComponent),
	},
	{
		path: 'products',
		loadComponent: () =>
			import('@manage/feature/products/products.component').then((m) => m.ProductsComponent),
	},
] satisfies Route[];
