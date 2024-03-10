import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Article } from '../model/article';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) {}

  getArticles() {
    return this.http.get<Article[]>(`${this.endpoint}/api/article`);
  }

  getArticle(id: string) {
    return this.http.get<Article>(`${this.endpoint}/api/article/${id}`);
  }

  createArticle(article: Article) {
    console.log('createArticle', article);
    console.log('this.endpoint', this.endpoint);
    return this.http.post(`${this.endpoint}/api/2article`, article);
  }

  updateArticle(id: string, article: Article) {
    return this.http.put<Article>(
      `${this.endpoint}/api/articles/${id}`,
      article,
    );
  }

  deleteArticle(id: string) {
    return this.http.delete<Article>(`${this.endpoint}/api/articles/${id}`);
  }
}
