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
  group_id: string;
}

export interface ViewProduct {
  id?: string;
  name: string;
  desc?: string;
  price: number;
  active: boolean;
  groupId: string;
  position: number;
  color?: string;
}
