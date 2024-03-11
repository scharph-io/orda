import { Article } from './article';

export interface Category {
  id?: string;
  name: string;
  desc?: string;
  position?: number;
  colored: boolean;
  withDeposit: boolean;
  articles?: Article[];
}
