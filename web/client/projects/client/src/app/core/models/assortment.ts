export interface AssortmentGroup {
	id: string;
	name: string;
	desc: string;
}

export interface AssortmentProduct {
	id: string;
	name: string;
	desc: string;
	price: number;
	active?: boolean;
	group_id?: string;
}
