export interface Group {
  id?: string;
  name: string;
  desc?: string;
  deposit: number;
  products?: Product[];
}

export interface Product {
  id?: string;
  name: string;
  desc?: string;
  price: number;
  active: boolean;
  group_id?: string;
  group?: string;
}
