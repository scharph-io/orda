export interface Article {
  id?: string;
  name: string;
  desc?: string;
  price: number;
  color?: string;
  active: boolean;
  position: number;
  categoryId: string;
}
