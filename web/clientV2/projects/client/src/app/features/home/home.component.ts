import { Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
	selector: 'orda-home',
	imports: [],
	template: `
		Auth {{ authService.isAuthenticated() }}
		<p>
			Welcome,
			{{ authService.user().username }} ({{ authService.user().role }})
		</p>

		<!--		https://lucide.dev/guide/packages/lucide-angular-->
		<!--		https://sebastianviereck.de/httponly-und-secure-cookies-in-angular/-->
	`,
	styles: ``,
})
export class HomeComponent {
	authService = inject(AuthService);
}
