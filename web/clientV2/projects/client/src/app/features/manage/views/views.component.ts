import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewGroupsComponent } from '@orda.features/manage/views/groups/view-groups.component';

@Component({
	selector: 'orda-views',
	imports: [ViewGroupsComponent],
	template: ` <orda-view-groups />`,
	styleUrl: './views.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewsComponent {}
