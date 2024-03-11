export interface TransactionItem {
  id?: string;
  desc: string;
  qty: number;
  transaction_id: string;
}

export interface Transaction {
  id?: string;
  total: number;
  payment_method: number;
  account_type: number;
  items: string[];
}
