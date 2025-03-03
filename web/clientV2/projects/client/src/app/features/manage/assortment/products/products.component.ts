import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { AssortmentGroupService } from '@orda.features/data-access/services/assortment/assortment-group.service';

@Component({
	selector: 'orda-assortment-products',
	template: `
		products
		<!--		@for (product of products.value(); track product.id) {-->
		<!--			{{ product.name }} ({{ product.desc }}) {{ product.price | currency }}<br />-->
		<!--		}-->
	`,
	imports: [],
	styles: ``,
})
export class AssortmentProductsComponent {
	private readonly route = inject(ActivatedRoute);
	groupService = inject(AssortmentGroupService);

	products = rxResource({
		loader: () =>
			this.groupService.readProductsByGroupId(this.route.snapshot.paramMap.get('id') ?? ''),
	});
}
