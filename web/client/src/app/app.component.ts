import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationComponent } from './shared/notification/notification.component';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'orda-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    RouterModule,
    MatDividerModule,
    NotificationComponent,
    TranslocoModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  appname = 'orda';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  get isAuthenticated() {
    return this.auth.authState$;
  }

  get isAdmin() {
    return this.auth.isAdmin();
  }

  get username() {
    return this.auth.username.toLocaleUpperCase();
  }
}
