import { Component, OnInit, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTabsModule } from '@angular/material/tabs';
import { StatisticOverallComponent } from './tabs/stat-overall.component';
import { StatisticDailyComponent } from './tabs/stat-daily.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'orda-statistic',
  standalone: true,
  template: `<h1>Statistik</h1>
    <mat-tab-group>
      @if (isAdmin) {
        <mat-tab [label]="'statistic.overall' | transloco">
          <ng-template matTabContent>
            <orda-stat-overall />
          </ng-template>
        </mat-tab>
      }
      <mat-tab [label]="'statistic.daily' | transloco">
        <ng-template matTabContent>
          <orda-stat-daily [isAdmin]="isAdmin" />
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
  auth = inject(AuthService);

  ngOnInit(): void {}

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }
}
