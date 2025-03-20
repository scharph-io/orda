import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewListComponent } from '@orda.features/manage/views/view-list/view-list.component';

@Component({
	selector: 'orda-views',
	imports: [ViewListComponent],
	template: ` <orda-view-list />`,
	styleUrl: './views.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewsComponent {}
