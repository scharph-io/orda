import { Product } from './product';

export interface ViewProduct extends Product {
  position: number;
  color?: string;
}

export interface ViewGroup {
  id?: string;
  name: string;
  desc?: string;
  position: number;
  products: ViewProduct[];
}

type ViewGroupMap = {
  [key: string]: ViewGroup;
};

export interface View {
  id: string;
  name?: string;
  assortment?: ViewGroupMap;
}
