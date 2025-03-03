import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AssortmentGroupsComponent } from '@orda.features/manage/assortment/groups/groups.component';

@Component({
	selector: 'orda-assortment',
	imports: [MatButtonModule, MatListModule, RouterModule, AssortmentGroupsComponent],
	template: ` <orda-assortment-groups /> `,
	styles: ``,
})
export class AssortmentComponent {}
