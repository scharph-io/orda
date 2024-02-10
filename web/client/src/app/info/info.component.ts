import { Component } from '@angular/core';
import { VERSION } from '../../core/version';

@Component({
  selector: 'orda-info',
  template: `
    <div class="container">
      <h2>Orda Client</h2>
      <p>Version: {{ VERSION }}</p>
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
  VERSION = VERSION;
}
