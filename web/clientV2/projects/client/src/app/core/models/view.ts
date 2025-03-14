import { AssortmentProduct } from '@orda.core/models/assortment';
import { Role } from '@orda.core/models/role';

export interface View {
	id: string;
	name: string;
	assortment: AssortmentProduct[];
	roles: Role[];
}

export interface ViewProduct {
	id: string;
	name: string;
}
