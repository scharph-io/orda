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
        formGroup.valid &&
        formGroup.value.new_balance !== undefined &&
        formGroup.value.new_balance !== null &&
        formGroup.value.new_balance > 0 &&
        formGroup.value.new_balance <= 100
      "
    ></orda-dialog-template>
    <ng-template #template>
      <mat-dialog-content>
        <form [formGroup]="formGroup" class="form-container">
          <mat-form-field>
            <mat-label>Betrag in €</mat-label>
            <input matInput type="number" formControlName="new_balance" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Grund</mat-label>
            <input matInput type="string" formControlName="reason" />
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
    new_balance: new FormControl(undefined, [Validators.required, Validators.min(0)]),
    reason: new FormControl('', [Validators.required]),
  });

  constructor() {
    super();
  }

  public submit = () => {
    this.accountService
      .correct(this.inputData.id ?? '', {
        new_balance: Number(((this.formGroup.value.new_balance ?? 0) * 100).toFixed(0)),
        reason: this.formGroup.value.reason ?? '',
      })
      .subscribe(this.closeObserver);
  };
}
