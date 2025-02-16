import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AssortmentGroupService } from '@orda.features/data-access/services/assortment/assortment-group.service';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { RouterModule } from '@angular/router';
import { AssortmentGroupsComponent } from './groups/groups.component';

@Component({
	selector: 'orda-assortment',
	imports: [MatButtonModule, MatListModule, RouterModule, AssortmentGroupsComponent],
	template: `
		<div class="title-toolbar">
			<h2>Assortment</h2>
			<orda-assortment-groups />
		</div>
	`,
	styles: ``,
})
export class AssortmentComponent {
	groupService = inject(AssortmentGroupService);
	logger = inject(OrdaLogger);

	create(): void {
		console.log('Create new Assortment Group');
	}
}
