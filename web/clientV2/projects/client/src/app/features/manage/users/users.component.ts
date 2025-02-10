import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'orda-users',
	imports: [],
	template: `
		<div class="title-toolbar">
			<h2>Roles</h2>
			<button mat-button (click)="create()">New</button>
		</div>
	`,
	styleUrl: './users.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
	create() {
		console.log('create user');
	}
}
