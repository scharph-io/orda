import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { ManageComponent } from './manage/manage.component';
import { HistoryComponent } from './history/history.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticComponent } from './statistics/statistic.component';
import { AssortmentOverviewComponent } from './manage/assortment/overview.component';
import { GroupsOverviewComponent } from './manage/assortment/group/groups-overview.component';
import { GroupDetailsDialogComponent } from './manage/assortment/group/group-details-dialog.component';

export const routes: Routes = [
  { path: 'assortment/group/:id', component: GroupDetailsDialogComponent },
  { path: 'assortment', component: AssortmentOverviewComponent },

  // { path: 'login', component: LoginComponent },
  // { path: 'manage', component: ManageComponent, canActivate: [AuthGuard] },
  // { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  // {
  //   path: 'statistic',
  //   component: StatisticComponent,
  //   canActivate: [AuthGuard],
  // },
  // { path: 'info', component: SettingsComponent, canActivate: [AuthGuard] },
  // { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
