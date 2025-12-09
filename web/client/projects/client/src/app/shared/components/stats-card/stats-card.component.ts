import { Component } from '@angular/core';

@Component({
  selector: 'orda-stats-card',
  imports: [],
  template: `
    <!-- stats-card.component.html -->
    <section class="stats-card">
      @for (s of stats; track s; let idx = $index) {
        <div class="stat" [class.has-divider]="idx !== 0">
          <h3 class="stat__label">{{ s.label }}</h3>
          <div class="stat__value">
            <span class="stat__number">{{ s.value }}</span>
            @if (s.unit) {
              <span class="stat__unit">{{ s.unit }}</span>
            }
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './stats-card.component.scss',
})
export class StatsCardComponent {
  stats = [
    // { label: 'Number of deploys', value: 405 },
    { label: 'Average deploy time', value: 3.65, unit: 'mins' },
    { label: 'Number of servers', value: 3 },
    { label: 'Success rate', value: '98.5', unit: '%' },
    { label: 'Number of servers', value: 3 },
  ];
}
