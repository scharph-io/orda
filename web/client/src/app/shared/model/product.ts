export interface Product {
  id?: string;
  name: string;
  desc?: string;
  price: number;
  active: boolean;
  groupId: string;
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
