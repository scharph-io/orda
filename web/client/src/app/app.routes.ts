import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { ManageComponent } from './manage/manage.component';
import { HistoryComponent } from './history/history.component';
import { InfoComponent } from './info/info.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'manage', component: ManageComponent, canActivate: [AuthGuard] },
  // { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  // { path: 'info', component: InfoComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
