import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { Account } from '@orda.core/models/account';

import { JsonPipe } from '@angular/common';

@Component({
	selector: 'orda-account-details-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButton,
		MatDialogActions,
		MatDialogTitle,
		MatDialogContent,
		MatDialogClose,
		JsonPipe,
	],
	template: ` <h2 mat-dialog-title>Details</h2>
		<mat-dialog-content>
			<pre>
        <code>
        {{ account | json }}
        </code>
      </pre>

			<button mat-button>Delete</button>
			<button mat-button>Edit</button>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Close</button>
		</mat-dialog-actions>
		‚`,
	styles: ``,
})
export class AccountDetailDialogComponent {
	protected readonly account = inject<Account>(MAT_DIALOG_DATA);
	protected readonly dialogRef: MatDialogRef<AccountDetailDialogComponent> = inject(MatDialogRef);
}
