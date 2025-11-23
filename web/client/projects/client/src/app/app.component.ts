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
			.header {
				position: sticky;
				top: 0;
				z-index: 1000;
			}
			.content {
				height: calc(100dvh - 64px);
				overflow-y: hidden;
			}
		`,
	],
})
export class AppComponent {
	title = 'orda';
	sessionService = inject(SessionService);
	router = inject(Router);
	toolbarTitleService = inject(ToolbarTitleService);

	info = rxResource({
		stream: () => this.sessionService.info(),
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
