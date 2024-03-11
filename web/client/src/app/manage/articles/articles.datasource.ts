import { DataSource } from '@angular/cdk/collections';
import { Article } from '../../shared/model/article';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { inject } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ArticleDataSource extends DataSource<Article> {
  /** Stream of data that is provided to the table. */
  data = new BehaviorSubject<Article[]>([]);
  destroyed$ = new Subject<void>();

  constructor(categoryId: string) {
    super();
    inject(ArticleService)
      .getArticlesBy(categoryId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((articles) => {
        this.data.next(articles);
      });
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Article[]> {
    return this.data;
  }

  disconnect() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
