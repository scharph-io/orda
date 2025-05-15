import { Component, inject, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SessionService } from '@orda.core/services/session.service';
import { GridColSizeService } from '@orda.shared/services/gridcolsize.service';

interface Tile {
	title: string;
	path: string;
	icon: string;
	canActivate?: () => boolean;
}

@Component({
	selector: 'orda-home',
	imports: [MatGridListModule, MatIcon],
	template: `
		<h1>
			Wilkommen,
			{{ sessionService.user().username }}
		</h1>

		<div class="container">
			<mat-grid-list [cols]="gridCol.size()" [gutterSize]="'0.5rem'">
				@for (tile of primaryTiles(); track tile) {
					@if (tile.canActivate ? tile.canActivate() : true) {
						<mat-grid-tile (click)="navigateTo(tile.path)" [colspan]="1" [rowspan]="1"
							><div class="tile-content">
								<mat-icon aria-hidden="false">
									{{ tile.icon }}
								</mat-icon>
								<span class="tile-text">{{ tile.title }}</span>
							</div>
						</mat-grid-tile>
					}
				}
			</mat-grid-list>
		</div>

		<!-- <h2>TODOs for v0.2.1</h2>
		<ul>
			<li>Colors</li>
			<li>Order UI settings set grid cols to auto, 2-5</li>
			<li>Manual deposit</li>
		</ul> -->

		<!--		https://lucide.dev/guide/packages/lucide-angular-->
		<!--		https://sebastianviereck.de/httponly-und-secure-cookies-in-angular/-->
		<!-- https://taiga-ui.dev/utils/tokens -->
	`,
	styles: `
		mat-grid-tile {
			border: 1px solid lightgray;
			border-radius: 0.5rem;
			background-color: #f2f4f7;
		}

		mat-icon {
			height: 3rem;
			width: 3rem;
			font-size: 3rem;
		}

		.tile-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
		}

		.tile-text {
			margin-top: 0.5rem;
			font-size: 1.5rem;
		}
	`,
})
export class HomeComponent {
	sessionService = inject(SessionService);
	private readonly router = inject(Router);

	gridCol = inject(GridColSizeService);

	primaryTiles = signal<Tile[]>([
		{
			title: 'Verwalten',
			path: '/manage',
			icon: 'settings',
			canActivate: () => this.sessionService.hasAdminRole(),
		},
		{
			title: 'Laden',
			path: '/order',
			icon: 'storefront',
		},
	]);

	navigateTo(path: string) {
		return this.router.navigate([path]);
	}
}
