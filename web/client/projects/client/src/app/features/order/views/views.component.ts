import { Component, inject, signal } from '@angular/core';
import { OrderDesktopComponent } from '@orda.features/order/views/desktop/desktop.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'orda-views',
  imports: [OrderDesktopComponent],
  template: `
    <orda-order-desktop [view]="view_id()"></orda-order-desktop>
  `,
  styleUrl: './views.component.scss'
})
export class ViewsComponent {

  view_id = signal<string>(inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '');


}
