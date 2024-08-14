import { Product, ViewProduct } from './product';

export interface Category {
  id?: string;
  name: string;
  desc?: string;
  position: number;
  color?: string;
  withDeposit: boolean;
  deposit?: number;
  products?: ViewProduct[];
}
