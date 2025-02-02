import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
	selector: 'orda-root',
	templateUrl: './app.component.html',
	imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
	styles: [
		`
			.spacer {
				flex: 1 1 auto;
			}
		`,
	],
})
export class AppComponent {
	title = 'orda';
	authService = inject(AuthService);
	router = inject(Router);

	isAuthenticated = signal(false);

	constructor() {
		// this.authService.getSession().subscribe({
		// 	next: () => {
		// 		this.isAuthenticated.set(true);
		// 	},
		// 	error: () => {
		// 		this.isAuthenticated.set(false);
		// 	},
		// });
	}

	logout() {
		this.authService.logout().subscribe({
			next: (data) => {
				console.log(data.message);
			},
			error: (err) => {
				console.error(err);
			},
		});
	}

	hasSession() {
		return this.authService.hasSession();
	}
}
