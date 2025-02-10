import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
	MatDialog,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';

@Component({
	selector: 'orda-users',
	imports: [],
	template: `
		<div class="title-toolbar">
			<h2>Roles</h2>
			<button mat-button (click)="open()">New</button>
		</div>
	`,
	styleUrl: './users.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
	dialog = inject(MatDialog);

	open() {
		this.dialog.open<ExampleDialogComponent, string, boolean>(ExampleDialogComponent, {
			data: 'Are you sure you want to delete this item?',
		});
	}
}

@Component({
	template: `<h2 mat-dialog-title>Delete file</h2>
		<mat-dialog-content> Would you like to delete cat.jpeg? </mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close>No</button>
			<button mat-button mat-dialog-close cdkFocusInitial>Ok</button>
		</mat-dialog-actions>`,
	imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleDialogComponent {
	readonly dialogRef = inject(MatDialogRef<ExampleDialogComponent>);
}
