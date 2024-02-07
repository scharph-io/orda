import { Component } from '@angular/core';

@Component({
  selector: 'orda-info',
  template: `
    <div class="container">
      <h2>Orda Client</h2>
      <p>Version: 0.0.1-alpha</p>
      <p>Track your orders</p>
    </div>
  `,
  styles: [
    `
      .container {
        margin: 2rem 1rem;
      }
    `,
  ],
})
export class InfoComponent {
  constructor() {}
}
