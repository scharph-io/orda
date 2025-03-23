import { Component, inject } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountGroupService } from '@orda.features/data-access/services/account/account-group.service';
import { MatButton } from '@angular/material/button';
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { DEPOSIT_VALUES } from '@orda.core/constants';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { AccountGroup } from '@orda.core/models/account';

@Component({
	selector: 'orda-group-deposit-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButton,
		MatDialogActions,
		MatDialogTitle,
		MatDialogContent,
		MatDialogClose,
		MatButtonToggle,
		MatButtonToggleGroup,
		OrdaCurrencyPipe,
		MatOption,
		MatSelect,
		TitleCasePipe,
	],
	template: ` <h2 mat-dialog-title>Group Deposit</h2>
		<mat-dialog-content>
			<form [formGroup]="formGroup">
        <div class="dialog-flex">

          <mat-form-field>
            <mat-label>Group</mat-label>
            <mat-select formControlName="group">
              @for (group of accountGroupService.entityResource.value(); track group.id) {
                <mat-option [value]="group.id">{{ group.name | titlecase }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-button-toggle-group formControlName="amount" aria-label="Font Style">
            @for (val of DEPOSIT_VALUES; track val) {
              <mat-button-toggle [value]="val">{{ val | currency }}</mat-button-toggle>
            }
          </mat-button-toggle-group>
        </div>

			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Cancel</button>
			<button mat-button [disabled]="formGroup.invalid" (click)="submit()">Deposit</button>
		</mat-dialog-actions>
		‚`,
	styles: `
  `,
})
export class GroupDepositDialogComponent extends DialogTemplateComponent<AccountGroup> {
	accountGroupService = inject(AccountGroupService);

	formGroup = new FormGroup({
		amount: new FormControl(0, [Validators.required]),
		group: new FormControl('', [Validators.required]),
	});

	public submit = () => {
		this.accountGroupService
			.deposit(this.formGroup.value.group ?? '', {
				amount: this.formGroup.value.amount ?? 0,
				userid: 'anon',
			})
			.subscribe(this.closeObserver);
	};
	protected readonly DEPOSIT_VALUES = DEPOSIT_VALUES;
}
