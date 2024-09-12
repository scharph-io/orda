import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticComponent } from './statistics/statistic.component';
import { AssortmentOverviewComponent } from './manage/assortment/overview.component';
import { GroupsOverviewComponent } from './manage/assortment/group/groups-overview.component';
import { GroupDetailsComponent } from './manage/assortment/group/group-details.component';
import { ViewsOverviewComponent } from './manage/views/overview.component';
import { ClientsOverviewComponent } from './manage/clients/overview.component';
import { ViewDetailsComponent } from './manage/views/details/details.component';

export const routes: Routes = [
  { path: 'assortment/group/:id', component: GroupDetailsComponent },
  { path: 'assortment', component: AssortmentOverviewComponent },
  { path: 'views', component: ViewsOverviewComponent },
  { path: 'views/:id', component: ViewDetailsComponent },
  { path: 'clients', component: ClientsOverviewComponent },

  // { path: 'login', component: LoginComponent },
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
