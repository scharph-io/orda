import { Routes } from '@angular/router';
import { LoginComponent } from '@shared/components/login/login.component';
import { HomeComponent } from '@features/home/home.component';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login',
	},
	{
		path: 'login',
		loadComponent: () => LoginComponent,
	},
	{
		path: 'home',
		canActivate: [authGuard],
		loadComponent: () => HomeComponent,
	},
	{
		path: 'manage',
		canActivate: [authGuard],
		loadChildren: () => import('@features/manage/manage.routes'),
	},
];
