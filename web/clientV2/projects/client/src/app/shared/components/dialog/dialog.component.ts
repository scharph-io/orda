/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, inject, InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export const FORM = new InjectionToken<FormGroup>('form');

@Component({
	selector: 'orda-dialog',
	imports: [],
	template: `<p>dialog works!</p>`,
	styleUrl: './dialog.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent<T> {
	private readonly data = inject(MAT_DIALOG_DATA);
	private readonly dialogRef: MatDialogRef<DialogComponent<T>, T> = inject(MatDialogRef);

	constructor() {
		if (this.data) {
			console.log(this.data);
			console.log(this.dialogRef);
		}
	}

	protected cancelClick = () => this.dialogRef.close();

	protected submitClick = () => {
		this.dialogRef.close();
	};

	// patchTransform(fn: (data: T) => { [K in keyof F]: any }): {
	// 	[K in keyof F]: any;
	// } {
	// 	return fn(this.data);
	// }
}
