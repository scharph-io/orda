import { DialogModule } from '@angular/cdk/dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  WritableSignal,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';
import { Article } from '../../shared/model/article';
import { ArticleService } from '../../shared/services/article.service';
import { ArticleDataSource } from './articles.datasource';
import { CreateArticleDialogComponent } from './create-article-dialog.component';
import { Category } from '../../shared/model/category';

@Component({
  selector: 'orda-articles-manage',
  template: `
    <h2>
      Articles for {{ category().name }}
      <span
        ><button
          mat-raised-button
          color="primary"
          (click)="openArticleAddUpdateDialog()"
        >
          Add
        </button></span
      >
    </h2>

    <table cdk-table [dataSource]="dataSource()" style="margin: 1rem;">
      <ng-container cdkColumnDef="id">
        <th cdk-header-cell *cdkHeaderCellDef>ID</th>
        <td cdk-cell *cdkCellDef="let element">{{ element.id }}</td>
      </ng-container>
      <ng-container cdkColumnDef="name">
        <th cdk-header-cell *cdkHeaderCellDef>Name</th>
        <td cdk-cell *cdkCellDef="let element">{{ element.name }}</td>
      </ng-container>

      <ng-container cdkColumnDef="desc">
        <th cdk-header-cell *cdkHeaderCellDef>Description</th>
        <td cdk-cell *cdkCellDef="let element">{{ element.desc }}</td>
      </ng-container>

      <ng-container cdkColumnDef="price">
        <th cdk-header-cell *cdkHeaderCellDef>Price</th>
        <td cdk-cell *cdkCellDef="let element">
          {{ element.price | ordaCurrency }}
        </td>
      </ng-container>

      <ng-container cdkColumnDef="active">
        <th cdk-header-cell *cdkHeaderCellDef>Active</th>
        <td cdk-cell *cdkCellDef="let element">
          {{ element.active }}
        </td>
      </ng-container>

      <ng-container [matColumnDef]="'actions'">
        <th mat-header-cell *matHeaderCellDef>actions</th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button (click)="openArticleAddUpdateDialog(element)">
            <mat-icon mat-icon-button color="primary">edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteArticle(element.id)">
            <mat-icon mat-icon-button color="warn">delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
      <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  standalone: true,
  styles: [``],
  imports: [
    CdkTableModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    OrdaCurrencyPipe,
  ],
})
export class ArticlesManageComponent {
  category = input.required<Category>();
  dataSource: WritableSignal<Article[]> = signal([]);
  http = inject(HttpClient);

  dialog = inject(MatDialog);
  articleService = inject(ArticleService);

  displayedColumns: string[] = [
    'id',
    'name',
    'desc',
    'price',
    'active',
    'actions',
  ];

  constructor() {
    effect(() => {
      this.articleService
        .getArticlesBy(this.category().id)
        .subscribe((data) => {
          this.dataSource?.set(data);
        });
    });
  }

  openArticleAddUpdateDialog(article?: Article): void {
    const dialogRef = this.dialog.open(CreateArticleDialogComponent, {
      data: { article, categoryId: this.category().id },
      minWidth: '30rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.articleService
        .getArticlesBy(this.category().id)
        .subscribe((articles) => {
          this.dataSource?.set(articles);
        });
    });
  }

  deleteArticle(id: string) {
    this.articleService
      .deleteArticle(id)
      .pipe(
        switchMap(() => this.articleService.getArticlesBy(this.category().id)),
      )
      .subscribe((articles) => this.dataSource?.set(articles));
  }
}
