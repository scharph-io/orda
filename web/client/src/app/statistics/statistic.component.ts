import { Component, OnInit, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MatTabsModule } from '@angular/material/tabs';
import { StatisticOverallComponent } from './tabs/stat-overall.component';
import { StatisticDailyComponent } from './tabs/stat-daily.component';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'orda-statistic',
    template: `<mat-tab-group>
    <mat-tab [label]="'statistic.daily' | transloco">
      <ng-template matTabContent>
        <orda-stat-daily />
      </ng-template>
    </mat-tab>
    <mat-tab [label]="'statistic.overall' | transloco">
      <ng-template matTabContent>
        <orda-stat-overall />
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
    ]
})
export class StatisticComponent implements OnInit {
  ngOnInit(): void {}
}
