import { Routes } from '@angular/router';
import { LoginComponent } from '@orda.shared/components/login/login.component';
import { HomeComponent } from '@orda.features/home/home.component';
import { authGuard } from '@orda.core/guards/auth.guard';

export const routes: Routes = [
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
		loadChildren: () => import('@orda.features/manage/manage.routes'),
	},
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '**', redirectTo: 'home' },
];
