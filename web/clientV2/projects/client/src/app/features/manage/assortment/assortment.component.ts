import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AssortmentGroupService } from '@features/data-access/services/assortment.service';
import { OrdaLogger } from '@shared/services/logger.service';
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
	assortmentGroupService = inject(AssortmentGroupService);
	logger = inject(OrdaLogger);

	create(): void {
		console.log('Create new Assortment Group');
	}
}
