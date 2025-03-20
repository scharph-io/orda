import { Component, inject } from '@angular/core';
import { OrderService } from '@orda.features/data-access/services/order.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { OrderDesktopComponent } from '@orda.features/order/views/desktop/desktop.component';

@Component({
	selector: 'orda-order',
	imports: [MatTabsModule, MatIconModule, OrderDesktopComponent],
	template: ` <orda-order-desktop [views]="orderService.views.value() ?? []" /> `,
	styles: ``,
})
export class OrderComponent {
	orderService = inject(OrderService);

	constructor() {
		this.orderService.views.reload();
	}
}
