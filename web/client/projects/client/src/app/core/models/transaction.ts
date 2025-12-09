export interface Transaction {
  created_at: string;
  transaction_id: string;
  items_length: number;
  payment_option: number;
  total: number;
  account_id?: string;
  account_name?: string;
}

export interface TransactionSummary {
  period: {
    from: string;
    to: string;
  };
  summary: {
    payments: Record<number, number>;
    products: {
      name: string;
      desc: string;
      total_quantity: number;
    }[];
    views: {
      name: string;
      sum_total: number;
      sum_total_credit: number;
    }[];
  };
}
