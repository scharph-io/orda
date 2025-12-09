import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./views.component').then((c) => c.ViewsComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./view-details/view-details.component').then((m) => m.ViewDetailsComponent),
  },
] satisfies Routes;
