import { AssortmentProduct } from '@orda.core/models/assortment';
import { Role } from '@orda.core/models/role';

export interface View {
	id: string;
	name: string;
	products: AssortmentProduct[];
	roles: Role[];
	products_count: number;
	roles_count: number;
	deposit: number;
}

export interface ViewProduct {
	id: string;
	name: string;
	desc: string;
	price: number;
	position: number;
	color: string;
	product_id: string;
}
