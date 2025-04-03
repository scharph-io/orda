export interface Transaction {
	created_at: string;
	transaction_id: string;
	items_length: number;
	payment_option: number;
	total: number;
	account_id?: string;
}

export interface TransactionSummary {
	totals: Record<number, number>;
}
