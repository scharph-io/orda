import { Routes } from '@angular/router';
import { LoginComponent } from '@shared/components/login/login.component';

export const routes: Routes = [
	{
		path: 'manage',
		loadChildren: () => import('@features/manage/manage.routes'),
	},
	{
		path: 'login',
		loadComponent: () => LoginComponent,
	},
];
