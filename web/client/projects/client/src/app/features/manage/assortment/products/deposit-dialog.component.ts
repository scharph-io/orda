import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
	FormsModule,
	ReactiveFormsModule,
	FormGroup,
	FormControl,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MatDialogTitle,
	MatDialogContent,
	MatDialogActions,
	MatDialogClose,
	MAT_DIALOG_DATA,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { GroupDeposit } from '@orda.core/models/assortment';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';

@Component({
	selector: 'orda-assortment-group-dialog',
	imports: [
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		MatButtonModule,
		MatLabel,
		MatFormFieldModule,
		MatInput,
		FormsModule,
		ReactiveFormsModule,
		MatSlideToggle,
		JsonPipe,
	],
	template: ` <h2 mat-dialog-title>Deposit</h2>
		<mat-dialog-content>
			{{ data | json }}
			<form [formGroup]="formGroup">
				<mat-slide-toggle formControlName="active">{{
					formGroup.value.active ? 'active' : 'inactive'
				}}</mat-slide-toggle>
				@if (formGroup.value.active) {
					<mat-form-field>
						<mat-label>Price</mat-label>
						<input matInput type="number" formControlName="price" />
					</mat-form-field>
				}
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Close</button>
			<button mat-button (click)="remove()" [disabled]="!data.deposit">Remove</button>
			<button mat-button (click)="submit()" [disabled]="!formGroup.valid">Save</button>
		</mat-dialog-actions>`,
	styles: ``,
})
export class DepositDialogComponent {
	assortmentService = inject(AssortmentService);
	data = inject<{ groupId: string; deposit: GroupDeposit | undefined }>(MAT_DIALOG_DATA);
	protected readonly dialogRef: MatDialogRef<DepositDialogComponent, number> = inject(MatDialogRef);

	formGroup = new FormGroup({
		price: new FormControl(0, [Validators.required]),
		active: new FormControl(true, Validators.required),
	});

	constructor() {
		if (this.data.deposit) {
			this.formGroup.patchValue({
				price: this.data.deposit.price,
				active: this.data.deposit.active,
			});
		} else {
			this.formGroup.patchValue({
				active: false,
			});
		}
	}

	submit() {
		this.assortmentService
			.setDeposit(
				this.data.groupId,
				this.formGroup.value.price ?? 0,
				this.formGroup.value.active ?? false,
			)
			.subscribe({
				next: () => {
					this.dialogRef.close(0);
				},
				error: (err) => {
					console.error(err);
					this.dialogRef.close(-1);
				},
			});
	}

	remove() {
		this.assortmentService.removeDeposit(this.data.groupId).subscribe({
			next: () => {
				this.dialogRef.close(0);
			},
			error: (err) => {
				console.error(err);
				this.dialogRef.close(-1);
			},
		});
	}
}
