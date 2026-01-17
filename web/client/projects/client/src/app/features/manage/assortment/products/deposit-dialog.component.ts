import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GroupDeposit } from '@orda.core/models/assortment';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';

interface DepositForm {
  price: FormControl<number | null>;
  active: FormControl<boolean>;
}

@Component({
  selector: 'orda-assortment-group-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, // Includes MatInput
    MatSlideToggleModule,
  ],
  template: `
    <h2 mat-dialog-title>Pfand</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="deposit-form">
        <mat-slide-toggle formControlName="active"> Pfand aktiv </mat-slide-toggle>

        <mat-form-field appearance="outline">
          <mat-label>Betrag</mat-label>
          <input
            matInput
            type="number"
            formControlName="price"
            placeholder="0.00"
            [disabled]="form.controls.active.value"
          />
          <span matTextSuffix>€</span>
          @if (form.controls.price.hasError('min')) {
            <mat-error>Mindestens 0.50 €</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Abbrechen</button>

      @if (data.deposit) {
        <button mat-button color="warn" (click)="remove()">Löschen</button>
      }

      <button
        mat-flat-button
        color="primary"
        (click)="submit()"
        [disabled]="form.invalid || form.pristine"
      >
        Speichern
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .deposit-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-top: 1rem;
        min-width: 300px;
      }
    `,
  ],
})
export class DepositDialogComponent implements OnInit {
  private readonly assortmentService = inject(AssortmentService);
  private readonly dialogRef = inject(MatDialogRef<DepositDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly data = inject<{ groupId: string; deposit: GroupDeposit | undefined }>(
    MAT_DIALOG_DATA,
  );

  // 1. Strictly typed form
  protected form = new FormGroup<DepositForm>({
    price: new FormControl(null, [Validators.required, Validators.min(0.5)]),
    active: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit() {
    this.initializeForm();
    this.setupActiveToggleListener();
  }

  private initializeForm() {
    if (this.data.deposit) {
      this.form.patchValue({
        price: this.data.deposit.price / 100, // Convert Cents to Euro
        active: this.data.deposit.active,
      });
    } else {
      this.form.patchValue({ active: false });
    }

    // Initial check to disable price if starting inactive
    this.updatePriceControlState(this.form.controls.active.value);
  }

  // 2. Listen to toggle changes to Enable/Disable price input
  // This ensures the form is valid when 'active' is false, even if price is empty
  private setupActiveToggleListener() {
    this.form.controls.active.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isActive) => {
        this.updatePriceControlState(isActive);
      });
  }

  private updatePriceControlState(isActive: boolean) {
    const priceControl = this.form.controls.price;
    if (isActive) {
      priceControl.enable();
    } else {
      priceControl.disable();
    }
  }

  submit() {
    if (this.form.invalid) return;

    const { price, active } = this.form.getRawValue(); // getRawValue to get price even if disabled

    // Convert Euro to Cents and handle nulls
    const priceInCents = price ? Math.round(price * 100) : 0;

    this.assortmentService.setDeposit(this.data.groupId, priceInCents, active).subscribe({
      next: () => this.dialogRef.close(true), // Return meaningful boolean
      error: (err) => {
        console.error('Error saving deposit', err);
        // Optional: Add Toast/Snackbar here
      },
    });
  }

  remove() {
    if (!confirm('Pfand wirklich löschen?')) return; // Simple safety check

    this.assortmentService.removeDeposit(this.data.groupId).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Error removing deposit', err),
    });
  }
}
