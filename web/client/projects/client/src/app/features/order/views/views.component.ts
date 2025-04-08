import { Component, inject, signal } from '@angular/core';
import { OrderDesktopComponent } from '@orda.features/order/views/desktop/desktop.component';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ToolbarTitleService } from '@orda.shared/services/toolbar-title.service';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { View } from '@orda.core/models/view';

@Component({
	selector: 'orda-views',
	imports: [OrderDesktopComponent],
	template: ` <orda-order-desktop [view]="view_id()"></orda-order-desktop>`,
	styleUrl: './views.component.scss',
})
export class ViewsComponent {
	toolbarTitleService = inject(ToolbarTitleService);
	router = inject(Router);
	viewService = inject(ViewService);

	view_id = signal<string>(inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '');
	view = rxResource<View, string>({
		request: () => this.view_id(),
		loader: ({ request }) => this.viewService.readById(request),
	});

	constructor() {
		this.toolbarTitleService.title.set(this.view.value()?.name ?? '');
		// this.view.reload();
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.toolbarTitleService.title.set('');
			}
		});
	}
}
