import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./manage.component').then((m) => m.ManageComponent),
  },
  {
    path: 'assortment',
    loadComponent: () =>
      import('./assortment/assortment.component').then(
        (m) => m.AssortmentComponent
      ),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./roles/roles.component').then((m) => m.RolesComponent),
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./accounts/accounts.component').then((m) => m.AccountsComponent),
  },
] satisfies Route[];
