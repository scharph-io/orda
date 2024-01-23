export interface Article {
  name: string;
  price: number;
}

export interface ArticleGroup {
  id: number;
  name: string;
  articles: Article[];
}
