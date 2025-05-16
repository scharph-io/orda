import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountService } from '@orda.features/data-access/services/account/account.service';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { Account } from '@orda.core/models/account';

@Component({
	selector: 'orda-account-correction-dialog',
	imports: [
		MatDialogModule,
		MatInput,
		FormsModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		DialogTemplateComponent,
	],
	template: `
		<orda-dialog-template
			[customTemplate]="template"
			[form]="formGroup"
			[title]="'Korrektur Kontostand'"
			(submitClick)="submit()"
			[canSubmit]="
				this.inputData.credit_balance !== this.formGroup.controls.new_balance.value &&
				(this.formGroup.controls.new_balance.value ?? 0) < this.inputData.credit_balance
			"
		></orda-dialog-template>
		<ng-template #template>
			<mat-dialog-content>
				<form [formGroup]="formGroup">
					<mat-form-field>
						<mat-label>Neu</mat-label>
						<input matInput type="number" formControlName="new_balance" />
					</mat-form-field>
					<mat-form-field>
						<mat-label>Grund</mat-label>
						<input matInput type="string" formControlName="reason" placeholder="Optional" />
					</mat-form-field>
				</form>
			</mat-dialog-content>
		</ng-template>
	`,
	styleUrl: './account-correction-dialog.component.scss',
})
export class AccountCorrectionDialogComponent extends DialogTemplateComponent<Account> {
	accountService = inject(AccountService);
	formGroup = new FormGroup({
		new_balance: new FormControl(this.inputData.credit_balance, [Validators.required]),
		reason: new FormControl(''),
	});

	constructor() {
		super();
	}

	public submit = () => {
		this.accountService
			.correct(this.inputData.id ?? '', {
				new_balance: this.formGroup.value.new_balance ?? 0,
				reason: this.formGroup.value.reason ?? '',
			})
			.subscribe(this.closeObserver);
	};
}
