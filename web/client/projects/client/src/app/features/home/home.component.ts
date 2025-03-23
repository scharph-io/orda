import { Component, inject, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { SessionService } from '@orda.core/services/session.service';

interface Tile {
	title: string;
	path: string;
	canActivate?: () => boolean;
}

@Component({
	selector: 'orda-home',
	imports: [MatGridListModule],
	template: `
		<h2 style="margin: 0.5rem">
			Welcome,
			{{ sessionService.user().username }}
		</h2>

		<div class="container">
			<h3>Menu</h3>
			<mat-grid-list
				style="width: 50%"
				[cols]="primaryTiles().length"
				rowHeight="5rem"
				[gutterSize]="'0.5rem'"
			>
				@for (tile of primaryTiles(); track tile) {
					@if (tile.canActivate ? tile.canActivate() : true) {
						<mat-grid-tile (click)="navigateTo(tile.path)" [colspan]="1" [rowspan]="1"
							>{{ tile.title }}
						</mat-grid-tile>
					}
				}
			</mat-grid-list>
		</div>

		<!--		https://lucide.dev/guide/packages/lucide-angular-->
		<!--		https://sebastianviereck.de/httponly-und-secure-cookies-in-angular/-->
		<!-- https://taiga-ui.dev/utils/tokens -->
	`,
	styles: `
		.container {
			margin: 0.5rem;
		}

		mat-grid-tile {
			background-color: rgba(67, 98, 191, 0.67);
		}
	`,
})
export class HomeComponent {
	sessionService = inject(SessionService);
	private readonly router = inject(Router);

	primaryTiles = signal<Tile[]>([
		{
			title: 'Manage',
			path: '/manage',
			canActivate: () => this.sessionService.hasAdminRole(),
		},
		{
			title: 'Order',
			path: '/order',
		},
	]);

	navigateTo(path: string) {
		return this.router.navigate([path]);
	}
}
