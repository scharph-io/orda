import { Product } from './product';

export interface Category {
  id?: string;
  name: string;
  desc?: string;
  position: number;
  color?: string;
  withDeposit: boolean;
  deposit?: number;
  products?: Product[];
}
