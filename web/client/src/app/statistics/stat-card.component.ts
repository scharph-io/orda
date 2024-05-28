import { Component, input } from '@angular/core';

@Component({
  selector: 'orda-stat-card',
  standalone: true,
  template: `
    <div class="container">
      <div class="item-0">{{ value() }}</div>
      <div class="item-1">{{ title() }}</div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        height: 10em;
        width: 10.5em;
      }

      @media (min-width: 1000px) {
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          height: 10em;
          width: 15em;
        }
      }

      .item-0 {
        flex-grow: 3;
        flex-shrink: 1;
        align-self: center;
        font-size: 1.8em;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .item-1 {
        flex-grow: 2;
        font-weight: lighter;
        text-align: center;
      }
    `,
  ],
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<number>();
}
