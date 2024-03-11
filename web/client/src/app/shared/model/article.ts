import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface Article {
  id?: string;
  name: string;
  desc?: string;
  price: number;
  color?: string;
  active: boolean;
  position?: number;
  categoryId: string;
}
