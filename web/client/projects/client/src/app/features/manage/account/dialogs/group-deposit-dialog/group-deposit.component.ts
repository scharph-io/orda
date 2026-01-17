import { Component, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Core / Shared
import { AccountGroupService } from '@orda.features/data-access/services/account/account-group.service';
import { DEPOSIT_VALUES } from '@orda.core/constants';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

interface GroupDepositForm {
  group: FormControl<string>;
  amount: FormControl<number | null>;
  reason: FormControl<string>;
}

@Component({
  selector: 'orda-group-deposit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    OrdaCurrencyPipe,
    TitleCasePipe,
  ],
  template: `
    <h2 mat-dialog-title>Gruppenbuchung</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-2 min-w-[300px]">
        <mat-form-field appearance="outline">
          <mat-label>Gruppe</mat-label>
          <mat-select formControlName="group">
            @for (group of groups.value(); track group.id) {
              <mat-option [value]="group.id">{{ group.name | titlecase }}</mat-option>
            }
          </mat-select>
          @if (form.controls.group.hasError('required')) {
            <mat-error>Gruppe ist erforderlich</mat-error>
          }
        </mat-form-field>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700" for="amount">Betrag</label>
          <mat-button-toggle-group formControlName="amount" class="flex flex-wrap">
            @for (val of DEPOSIT_VALUES; track val) {
              <mat-button-toggle [value]="val" class="flex-1">
                {{ val * 100 | currency }}
              </mat-button-toggle>
            }
          </mat-button-toggle-group>
          @if (form.controls.amount.hasError('required') && form.touched) {
            <mat-error class="text-xs">Betrag ist erforderlich</mat-error>
          }
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Kommentar</mat-label>
          <input matInput formControlName="reason" placeholder="z.B. Weihnachtsfeier" />
          @if (form.controls.reason.hasError('required')) {
            <mat-error>Kommentar ist erforderlich</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Abbrechen</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="form.invalid">
        Einzahlen
      </button>
    </mat-dialog-actions>
  `,
})
export class GroupDepositDialogComponent {
  private accountGroupService = inject(AccountGroupService);
  private dialogRef = inject(MatDialogRef<GroupDepositDialogComponent>);

  protected readonly DEPOSIT_VALUES = DEPOSIT_VALUES;

  // Ensure groups are loaded
  protected groups = rxResource({
    stream: () => this.accountGroupService.read(),
    defaultValue: [],
  });

  protected form = new FormGroup<GroupDepositForm>({
    group: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    amount: new FormControl(null, [Validators.required]),
    reason: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit() {
    if (this.form.invalid) return;

    const { group, amount, reason } = this.form.getRawValue();

    if (!amount || !group) return;

    this.accountGroupService
      .deposit(group, {
        amount: amount * 100, // Convert Euros to Cents for backend
        reason: reason,
      })
      .subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => console.error('Error processing group deposit', err),
      });
  }
}
