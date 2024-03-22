import { Component, OnInit, inject } from '@angular/core';
import {
  StatisticService,
  Statistics,
} from '../shared/services/statistic.service';
import { OrdaCurrencyPipe } from '../shared/currency.pipe';
import { AccountType, PaymentOption } from '../shared/util/transaction';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { StatisticOverallComponent } from './tabs/stat-overall.component';
import { StatisticDailyComponent } from './tabs/stat-daily.component';

@Component({
  selector: 'orda-statistic',
  standalone: true,
  template: `<h1>Statistik</h1>
    <mat-tab-group>
      <mat-tab [label]="'statistic.overall' | transloco">
        <ng-template matTabContent>
          <orda-stat-overall />
        </ng-template>
      </mat-tab>
      <mat-tab [label]="'statistic.daily' | transloco">
        <ng-template matTabContent>
          <!-- Content 2 - Loaded: {{ getTimeLoaded(2) | date: 'medium' }} -->
        </ng-template>
      </mat-tab>
    </mat-tab-group>`,
  styles: [
    `
      :host {
      }
    `,
  ],
  imports: [
    MatTabsModule,
    TranslocoModule,
    StatisticOverallComponent,
    StatisticDailyComponent,
  ],
})
export class StatisticComponent implements OnInit {
  ngOnInit(): void {}
}
