export interface AssortmentGroup {
	id: string;
	name: string;
	desc: string;
	priority?: number;
	deposit: GroupDeposit | undefined;
}

export type GroupDeposit = Pick<AssortmentProduct, 'price' | 'active' | 'group_id'>;

export interface AssortmentProduct {
	id: string;
	name: string;
	desc?: string;
	price: number;
	active?: boolean;
	group_id?: string;
}
