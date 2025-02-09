import { Component, inject } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { Role } from '@core/models/role';
import { MatButton } from '@angular/material/button';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
	selector: 'orda-role-dialog',
	imports: [
		MatDialogTitle,
		MatDialogContent,
		MatButton,
		FormsModule,
		MatDialogActions,
		ReactiveFormsModule,
		MatLabel,
		MatFormField,
		MatInput,
	],
	template: `
		<h2 mat-dialog-title>{{ data ? 'Update' : 'Create' }}</h2>
		<mat-dialog-content>
			<form [formGroup]="formGroup">
				<mat-form-field>
					<mat-label>Name</mat-label>
					<input matInput formControlName="name" />
				</mat-form-field>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button (click)="cancelClick()">Cancel</button>
			<button
				mat-button
				[disabled]="this.formGroup.invalid || !this.formGroup.dirty"
				(click)="submitClick()"
			>
				{{ data ? 'Update' : 'Save' }}
			</button>
		</mat-dialog-actions>
	`,
	styles: ``,
})
export class RoleDialogComponent {
	data = inject<Role>(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<RoleDialogComponent, Role> = inject(MatDialogRef);

	protected formGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.maxLength(10)]),
	});

	constructor() {
		if (this.data) {
			this.formGroup.patchValue({
				name: this.data.name,
			});
		}
	}

	protected cancelClick = () => this.dialogRef.close();

	protected submitClick = () => {
		if (this.formGroup.dirty) {
			this.dialogRef.close({
				name: this.formGroup.value.name ?? '',
			});
		}
	};
}
