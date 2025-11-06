import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./statistic.component').then((m) => m.StatisticComponent),
		children: [
			{
				path: 'day',
				loadComponent: () =>
					import('@orda.features/statistics/day/day.component').then((m) => m.DayComponent),
			},
			{
				path: 'month',
				loadComponent: () => import('./month/month.component').then((m) => m.MonthComponent),
			},
			{
				path: 'year',
				loadComponent: () => import('./year/year.component').then((m) => m.YearComponent),
			},
			{ path: '', pathMatch: 'full', redirectTo: 'day' },
		],
	},
] satisfies Routes;
