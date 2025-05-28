import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '@orda.core/services/session.service';
import { ToolbarTitleService } from '@orda.shared/services/toolbar-title.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
	selector: 'orda-root',
	templateUrl: './app.component.html',
	imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
	styles: [
		`
			.spacer {
				flex: 1 1 auto;
			}

			/*.version {*/
			/*	margin: 0 1rem;*/
			/*	font-size: 0.6em;*/
			/*}*/
		`,
	],
})
export class AppComponent {
	title = 'orda';
	sessionService = inject(SessionService);
	router = inject(Router);
	toolbarTitleService = inject(ToolbarTitleService);

	info = rxResource({
		loader: () => this.sessionService.info(),
	});

	logout() {
		this.sessionService.logout().subscribe({
			next: () => {
				return this.router.navigate(['/login']);
			},
			error: (err) => {
				console.error(err);
			},
		});
	}
}
