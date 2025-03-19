import { Component, inject } from '@angular/core';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'orda-order',
	imports: [JsonPipe],
	template: `
		<pre>
    <code>
      {{ orderService.views.value() | json }}
    </code>
  </pre>
	`,
	styles: ``,
})
export class OrderComponent {
	orderService = inject(OrderService);

	constructor() {
		this.orderService.views.reload();
	}
}
