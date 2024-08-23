import { Product } from './product';

export interface View {
  id: string;
  name?: string;
  products?: Product[];
}
