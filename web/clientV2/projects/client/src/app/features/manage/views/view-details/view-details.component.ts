import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ViewService } from '@orda.features/data-access/services/view/view.service';

@Component({
	selector: 'orda-view-details',
	imports: [],
	template: `
		<p>products works!</p>
		{{ view.value()?.id }}
	`,
	styles: ``,
})
export class ViewDetailsComponent {
	displayedColumns: string[] = ['name', 'desc', 'price', 'active', 'actions'];
	// private logger = inject(OrdaLogger);
	private viewService = inject(ViewService);

	private readonly route = inject(ActivatedRoute);
	view_id = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');

	view = rxResource({
		loader: () => this.viewService.readById(this.view_id()),
	});
}
