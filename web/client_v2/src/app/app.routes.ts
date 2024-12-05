import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../../projects/shared/src/public-api').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'order',
    loadComponent: () =>
      import('../../projects/ordering/src/public-api').then(
        (c) => c.OrderingComponent
      ),
  },
  {
    path: 'manage',
    loadChildren: () => import('../../projects/manage/src/lib/manage.routes'),
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('../../projects/statistics/src/lib/statistics.routes'),
  },
];
