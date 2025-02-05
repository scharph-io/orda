import { Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
	selector: 'orda-home',
	imports: [],
	template: `
		Auth {{ authService.isAuthenticated() }}
		<p>
			Welcome,
			{{ authService.getAuthenticatedUser().user }} ({{ authService.getAuthenticatedUser().role }})
		</p>
	`,
	styles: ``,
})
export class HomeComponent {
	authService = inject(AuthService);

	constructor() {
		// this.authService.session.subscribe({
		// 	next: (data) => {
		// 		this.user.set(data.username);
		// 	},
		// });
	}
}
