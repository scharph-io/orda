import { Product, ViewProduct } from './product';

export interface View {
  id: string;
  name?: string;
  products?: ViewProduct[];
}
