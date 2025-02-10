import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'orda-assortment',
	imports: [],
	template: `<p>assortment works!</p>`,
	styleUrl: './assortment.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssortmentComponent {}
