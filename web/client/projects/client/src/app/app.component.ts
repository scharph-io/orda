import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '@orda.core/services/session.service';

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
	sessionService = inject(SessionService);
	router = inject(Router);

	logout() {
		this.sessionService.logout().subscribe({
			next: () => {
				this.router.navigate(['/login']);
			},
			error: (err) => {
				console.error(err);
			},
		});
	}
}
