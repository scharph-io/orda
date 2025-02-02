import { Routes } from '@angular/router';
import { LoginComponent } from '@shared/components/login/login.component';
import { HomeComponent } from '@features/home/home.component';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => HomeComponent,
		pathMatch: 'full',
	},
	{
		path: 'manage',
		loadChildren: () => import('@features/manage/manage.routes'),
	},
	{
		path: 'login',
		loadComponent: () => LoginComponent,
	},
];
