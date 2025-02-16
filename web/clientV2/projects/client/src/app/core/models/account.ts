export interface AccountGroupResponse {
	id: string;
	name: string;
	accounts?: Account[];
}

export interface Account {
	id: string;
	firstname: string;
	lastname: string;
	main_balance: number;
	credit_balance: number;
	group?: string;
	last_deposit: number;
	last_deposit_type: number;
	last_deposit_time: string;
	last_balance: number;
}
