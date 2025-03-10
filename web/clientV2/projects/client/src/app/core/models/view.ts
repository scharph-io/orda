import { AssortmentProduct } from '@orda.core/models/assortment';

export interface View {
	id: string;
	name: string;
	assortment: AssortmentProduct[];
}

export interface ViewProduct {
	id: string;
	name: string;
}
