import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Article } from '../model/article';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    @Inject('ENDPOINT') private endpoint: String,
  ) {}

  getArticlesBy(categoryId: string) {
    return this.http.get<Article[]>(
      `${this.endpoint}/api/category/${categoryId}/article`,
    );
  }

  getArticle(id: string) {
    return this.http.get<Article>(`${this.endpoint}/api/article/${id}`);
  }

  createArticle(article: Article) {
    console.log(article);
    return this.http.post(`${this.endpoint}/api/article`, article, {
      headers: this.headers,
    });
  }

  importArticles(articles: Article[], categoryId: string) {
    return this.http.post(
      `${this.endpoint}/api/article/import?categoryId=${categoryId}`,
      articles,
      {
        headers: this.headers,
      },
    );
  }

  updateArticle(id: string, article: Article) {
    return this.http.put<Article>(
      `${this.endpoint}/api/article/${id}`,
      article,
      { headers: this.headers },
    );
  }

  deleteArticle(id: string) {
    return this.http.delete<Article>(`${this.endpoint}/api/article/${id}`);
  }
}
