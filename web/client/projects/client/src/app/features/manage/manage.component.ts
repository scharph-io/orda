import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRipple } from '@angular/material/core';
import { GridColSizeService } from '@orda.shared/services/gridcolsize.service';

interface Tile {
	title: string;
	path: string;
}

@Component({
	selector: 'orda-manage',
	imports: [RouterModule, MatButtonModule, MatGridListModule, MatRipple],
	template: `
		<h2>Manage</h2>
		<mat-grid-list [cols]="gridColumns()" [gutterSize]="'0.5rem'">
			@for (tile of primaryTiles(); track tile) {
				<mat-grid-tile mat-ripple (click)="navigateTo(tile.path)" [colspan]="1" [rowspan]="1"
					>{{ tile.title }}
				</mat-grid-tile>
			}
		</mat-grid-list>
	`,
	styles: `
		mat-grid-tile {
			background-color: lightgray;
		}
	`,
})
export class ManageComponent {
	private readonly router = inject(Router);
	gridColumns = inject(GridColSizeService).size;

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
