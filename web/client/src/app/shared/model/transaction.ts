export interface TransactionItem {
  id?: number;
  description: string;
  qty: number;
  transaction_id: string;
  article_id: string;
}

export interface Transaction {
  id?: number;
  total: number;
  payment_option: number;
  account_type: number;
  items: TransactionItem[];
  CreatedAt: string;
  transaction_nr: string;
}
