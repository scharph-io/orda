import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'orda-assortment-products',
	template: `{{ groupId }}`,
	styles: ``,
})
export class AssortmentProductsComponent implements OnInit {
	private readonly route = inject(ActivatedRoute);

	groupId?: string | null;

	ngOnInit(): void {
		this.groupId = this.route.snapshot.paramMap.get('id');
	}
}
