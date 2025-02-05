import { Routes } from '@angular/router';
import { LoginComponent } from '@shared/components/login/login.component';
import { HomeComponent } from '@features/home/home.component';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: 'login',
		loadComponent: () => LoginComponent,
		data: {
			titleKey: 'login',
		},
	},
	{
		path: 'home',
		canActivate: [authGuard],
		loadComponent: () => HomeComponent,
		data: {
			titleKey: 'login',
			roles: [],
		},
	},
	{
		path: 'manage',
		canActivate: [authGuard],
		loadChildren: () => import('@features/manage/manage.routes'),
		data: {
			titleKey: 'login',
			roles: ['admin'],
		},
	},
	{ path: '**', redirectTo: 'home' },
];
