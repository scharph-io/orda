import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
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
];
