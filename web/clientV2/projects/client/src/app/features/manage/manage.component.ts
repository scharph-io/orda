import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

interface Tile {
	title: string;
	path: string;
}

@Component({
	selector: 'orda-manage',
	imports: [RouterModule, MatButtonModule, MatGridListModule],
	template: `
		<h2>Manage</h2>
		<mat-grid-list [cols]="10" rowHeight="8rem" [gutterSize]="'0.5rem'">
			@for (tile of primaryTiles(); track tile) {
				<mat-grid-tile (click)="navigateTo(tile.path)" [colspan]="1" [rowspan]="1"
					>{{ tile.title }}
				</mat-grid-tile>
			}
		</mat-grid-list>
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
export class ManageComponent {
	private readonly router = inject(Router);

	primaryTiles = signal<Tile[]>([
		{ title: 'Views', path: '/manage/views' },

		{
			title: 'Assortment',
			path: '/manage/assortment',
		},
		{ title: 'Account', path: '/manage/accounts' },

		{ title: 'Users', path: '/manage/users' },
		{ title: 'History', path: '/manage/history' },
	]);

	navigateTo(path: string) {
		this.router.navigate([path]).catch(console.error);
	}
}
