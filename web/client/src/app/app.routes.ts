import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "", component: HomeComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];
