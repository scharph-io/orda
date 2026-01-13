import { Component, inject, signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatisticsService } from '@orda.features/data-access/services/statistics.service';
import { OrdaDayPickerComponent } from '@orda.shared/components/date-pickers/day-picker/day-picker.component';
import { DashboardComponent } from '@orda.features/statistics/dashboard/dashboard.component';

@Component({
  selector: 'orda-day',
  imports: [OrdaDayPickerComponent, DashboardComponent],
  providers: [provideNativeDateAdapter()],
  template: `
    <orda-day-picker
      [datesAllowed]="transactionDates.value()"
      (fromChange)="from.set($event)"
      [from]="from()"
      (toChange)="to.set($event)"
      [to]="to()"
    />
    <orda-dashboard [msg]="'today'" [from]="from()" [to]="to()" />
  `,
  styleUrls: ['./day.component.scss'],
})
export class DayComponent {
  statisticsService = inject(StatisticsService);

  current = signal(new Date());
  from = signal(
    new Date(this.current().getFullYear(), this.current().getMonth(), this.current().getDate()),
  );
  to = signal(
    new Date(this.current().getFullYear(), this.current().getMonth(), this.current().getDate() + 1),
  );

  transactionDates = rxResource({
    stream: () => this.statisticsService.getTransactionsDates(),
    defaultValue: [],
  });
}
