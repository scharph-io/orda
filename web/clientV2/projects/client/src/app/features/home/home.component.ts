import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@orda.core/services/auth.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';

interface Tile {
	title: string;
	path: string;
}

@Component({
	selector: 'orda-home',
	imports: [MatGridListModule],
	template: `
		<h2 style="margin: 0.5rem">
			Welcome,
			{{ authService.user().username }}
		</h2>

		<div class="container">
			<h3>Main</h3>
			<mat-grid-list
				style="width: 50%"
				[cols]="secondaryTiles().length"
				rowHeight="5rem"
				[gutterSize]="'0.5rem'"
			>
				@for (tile of primaryTiles(); track tile) {
					<mat-grid-tile (click)="navigateTo(tile.path)" [colspan]="1" [rowspan]="1"
						>{{ tile.title }}
					</mat-grid-tile>
				}
			</mat-grid-list>
		</div>

		<div class="container">
			<h3>Assortment</h3>
			<mat-grid-list
				style="width: 50%"
				[cols]="secondaryTiles().length"
				rowHeight="5rem"
				[gutterSize]="'0.5rem'"
			>
				@for (tile of secondaryTiles(); track tile) {
					<mat-grid-tile (click)="navigateTo(tile.path)" [colspan]="1" [rowspan]="1"
						>{{ tile.title }}
					</mat-grid-tile>
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
	authService = inject(AuthService);
	private readonly router = inject(Router);

	primaryTiles = signal<Tile[]>([{ title: 'Users', path: '/manage/users' }]);

	secondaryTiles = signal<Tile[]>([
		{ title: 'Assortment', path: '/manage/assortment' },
		{ title: 'Views', path: '/manage/views' },
		{ title: 'Account', path: '/manage/accounts' },
		{ title: 'History', path: '/manage/history' },
	]);

	navigateTo(path: string) {
		this.router.navigate([path]).catch(console.error);
	}
}
