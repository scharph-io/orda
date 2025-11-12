import { Component, input } from '@angular/core';

@Component({
  selector: 'orda-container',
  imports: [],
  template: `
    From {{from().toLocaleDateString()}} to {{to().toLocaleDateString()}}
		@if (msg()) {
			({{msg()}})
		}
  `,
  styleUrl: './container.component.scss',
})
export class ContainerComponent {

	msg = input<string>();

	from = input.required<Date>()
	to = input.required<Date>()

}
