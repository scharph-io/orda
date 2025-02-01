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
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./groups/groups.component').then((m) => m.GroupsComponent),
      },
    ],
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
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products.component').then((m) => m.ProductsComponent),
  },
] satisfies Route[];
