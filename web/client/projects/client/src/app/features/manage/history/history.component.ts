import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionsComponent } from '@orda.features/manage/history/transactions/transactions.component';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';

@Component({
  selector: 'orda-history',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    TransactionsComponent,
    NavSubHeaderComponent,
  ],
  template: `
    <orda-nav-sub-header title="Verlauf" [showBackButton]="true" />
    <main>
      <div class="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <mat-form-field style="margin: 0.5rem">
          <mat-label>Datum auswählen</mat-label>
          <input matInput [matDatepicker]="picker" [formControl]="date" />
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <!-- <mat-tab-group animationDuration="0ms" style="margin: 0 0.5rem">
          <mat-tab label="Transaktionen">
            
          </mat-tab>
          <mat-tab label="Statistik">
            <orda-statistics [date]="dateChanged() ?? ''" />
          </mat-tab>
        </mat-tab-group> -->
        <orda-transactions [date]="dateChanged() ?? ''" />
      </div>
    </main>
  `,
  styles: ``,
})
export class HistoryComponent {
  readonly date = new FormControl(new Date().toISOString());
  dateChanged = toSignal(this.date.valueChanges, {
    initialValue: new Date().toISOString(),
  });
}
