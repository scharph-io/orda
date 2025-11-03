import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./statistic.component').then((m) => m.StatisticComponent),
		children: [
			{path: 'current', loadComponent: () => import('./current/current.component').then((m) => m.CurrentComponent),},
			{path: 'month', 	loadComponent: () => import('./month/month.component').then((m) => m.MonthComponent),},
			{path: 'year', 		loadComponent: () => import('./year/year.component').then((m) => m.YearComponent),},
			{path: '', 				pathMatch: 'full', redirectTo:'current'},
		]

	},
] satisfies Routes;
