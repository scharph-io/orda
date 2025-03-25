import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRipple } from '@angular/material/core';
import { map, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';

interface Tile {
	title: string;
	path: string;
}

@Component({
	selector: 'orda-manage',
	imports: [RouterModule, MatButtonModule, MatGridListModule, MatRipple, AsyncPipe],
	template: `
		<h2>Manage</h2>
		<mat-grid-list [cols]="gridColumns$ | async" [gutterSize]="'0.5rem'">
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
	gridColumns$: Observable<number>;

	constructor() {
		this.gridColumns$ = inject(BreakpointObserver)
			.observe([
				Breakpoints.XSmall,
				Breakpoints.Small,
				Breakpoints.Medium,
				Breakpoints.Large,
				Breakpoints.XLarge,
			])
			.pipe(
				map(({ breakpoints }) => {
					if (breakpoints[Breakpoints.XSmall]) return 2; // Mobile
					if (breakpoints[Breakpoints.Small]) return 5; // Tablet
					if (breakpoints[Breakpoints.Medium]) return 6; // Desktop
					if (breakpoints[Breakpoints.Large]) return 8; // Large Desktop
					return 5; // XLarge screens
				}),
			);
	}

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
