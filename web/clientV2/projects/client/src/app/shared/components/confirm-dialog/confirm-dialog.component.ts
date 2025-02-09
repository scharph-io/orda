import { Component, inject } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

export interface ConfirmDialogData {
	message: string;
}

@Component({
	selector: 'orda-confirm-dialog',
	imports: [MatButton, MatDialogTitle, MatDialogContent, ReactiveFormsModule, MatDialogActions],
	template: ` <h2 mat-dialog-title>Confirm</h2>
		<mat-dialog-content> Are you sure? This cannot be reverted</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button (click)="cancelClick()">Cancel</button>
			<button class="red-btn" mat-button (click)="confirmClick()">Yes</button>
		</mat-dialog-actions>`,
	styles: ``,
})
export class ConfirmDialogComponent {
	data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> = inject(MatDialogRef);

	protected cancelClick = () => this.dialogRef.close();
	protected confirmClick = () => this.dialogRef.close(true);
}
