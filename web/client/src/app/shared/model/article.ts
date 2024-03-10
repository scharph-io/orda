import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface Article {
  uuid?: string;
  name: string;
  desc?: string;
  price: number;
  color?: string;
  active: boolean;
  position?: number;
}

export interface ArticleGroup {
  id: number;
  name: string;
  articles$: Observable<Article[]>;
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function createFakeArticles(
  items: number = 20,
  minMaxPrice: number = 10,
  factor: number = 0.2,
): Article[] {
  minMaxPrice *= 10;
  let data: Article[] = [];
  for (let i = 0; i < items; i++) {
    data.push({
      position: i + 1,
      name: `Product ${i + 1}`,
      desc: `desc ${i + 1}`,
      price:
        (randomIntFromInterval(
          minMaxPrice - minMaxPrice * factor,
          minMaxPrice + minMaxPrice * factor,
        ) /
          10) *
        100,
      uuid: uuidv4(),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      active: Math.random() > 0.5,
    });
  }
  return data;
}
