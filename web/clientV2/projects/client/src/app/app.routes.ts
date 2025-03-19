import { Routes } from '@angular/router';
import { LoginComponent } from '@orda.shared/components/login/login.component';
import { HomeComponent } from '@orda.features/home/home.component';
import { authGuard } from '@orda.core/guards/auth.guard';
import { OrderComponent } from '@orda.features/order/order.component';
import { manageGuard } from '@orda.core/guards/manage.guard';

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () => LoginComponent,
	},
	{
		path: 'home',
		canActivate: [authGuard, manageGuard],
		loadComponent: () => HomeComponent,
	},
	{
		path: 'manage',
		canActivate: [authGuard, manageGuard],
		loadChildren: () => import('@orda.features/manage/manage.routes'),
	},
	{
		path: 'order',
		canActivate: [authGuard],
		loadComponent: () => OrderComponent,
	},
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '**', redirectTo: 'home' },
];
