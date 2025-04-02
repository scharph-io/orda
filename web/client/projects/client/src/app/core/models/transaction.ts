export interface Transaction {
	transaction_id: string;
	items_length: number;
	total: number;
}

export interface TransactionSummary {
	total: number;
}
