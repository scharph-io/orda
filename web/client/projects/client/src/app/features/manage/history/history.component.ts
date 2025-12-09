import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TransactionsComponent } from '@orda.features/manage/history/transactions/transactions.component';
import { StatisticsComponent } from '@orda.features/manage/history/statistics/statistics.component';

@Component({
  selector: 'orda-history',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    TransactionsComponent,
    StatisticsComponent,
  ],
  template: `
    <mat-form-field style="margin: 0.5rem">
      <mat-label>Datum auswählen</mat-label>
      <input matInput [matDatepicker]="picker" [formControl]="date" />
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
    <mat-tab-group animationDuration="0ms" style="margin: 0 0.5rem">
      <mat-tab label="Transaktionen">
        <orda-transactions [date]="dateChanged() ?? ''" />
      </mat-tab>
      <mat-tab label="Statistik">
        <orda-statistics [date]="dateChanged() ?? ''" />
      </mat-tab>
    </mat-tab-group>
  `,
  styles: ``,
})
export class HistoryComponent {
  readonly date = new FormControl(new Date().toISOString());
  dateChanged = toSignal(this.date.valueChanges, {
    initialValue: new Date().toISOString(),
  });
}
