import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./statistic.component').then((m) => m.StatisticComponent),
	},
] satisfies Routes;
