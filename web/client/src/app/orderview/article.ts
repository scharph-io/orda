export interface Article {
  name: string;
  price: number;
  desc?: string
}

export interface ArticleGroup {
  id: number;
  name: string;
  articles: Article[];
}
