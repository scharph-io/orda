import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'orda-views',
	imports: [],
	template: `<p>views works!</p>`,
	styleUrl: './views.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewsComponent {}
