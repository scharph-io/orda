import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./statistics.component').then((m) => m.StatisticsComponent),
  },
] satisfies Route[];
