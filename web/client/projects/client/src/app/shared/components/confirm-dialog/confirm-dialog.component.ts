import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

export interface ConfirmDialogData {
  message: string;
  disableSubmit?: boolean;
}

@Component({
  selector: 'orda-confirm-dialog',
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatDialogActions,
  ],
  template: ` @let blocked = inputData.disableSubmit ?? false;
    <h2 mat-dialog-title>{{ !blocked ? 'Confirm' : 'Blocked' }}</h2>
    <mat-dialog-content> {{ inputData.message }}</mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      @if (!blocked) {
        <button class="delete-btn" mat-flat-button [mat-dialog-close]="true">Delete</button>
      }
    </mat-dialog-actions>`,
  styles: ``,
})
export class ConfirmDialogComponent {
  inputData = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  // dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> = inject(MatDialogRef);
}
