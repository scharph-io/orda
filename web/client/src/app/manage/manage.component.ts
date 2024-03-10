import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { ArticleDataSource } from './articles.datasource';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Article } from '../shared/model/article';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CreateArticleDialogComponent } from './create-article-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrdaCurrencyPipe } from '../shared/currency.pipe';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArticleService } from '../shared/services/article.service';
import { switchMap } from 'rxjs';

// Example ??? https://www.codeproject.com/Articles/5290817/Build-Angular-data-table-with-CRUD-operations-and
@Component({
  template: `
    <div class="container" style="margin: 1rem;">
      <h1>Manage</h1>

      <h2>Categories</h2>

      <h2>
        Articles
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

      <table cdk-table [dataSource]="articlesDataSource" style="margin: 1rem;">
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
            <button
              mat-icon-button
              (click)="openArticleAddUpdateDialog(element)"
            >
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
    </div>
  `,
  standalone: true,
  imports: [
    CdkTableModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    OrdaCurrencyPipe,
  ],
})
export class ManageComponent {
  articlesDataSource: ArticleDataSource = new ArticleDataSource();
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

  openArticleAddUpdateDialog(article?: Article): void {
    const dialogRef = this.dialog.open(CreateArticleDialogComponent, {
      data: article,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.articleService.getArticles().subscribe((articles) => {
        this.articlesDataSource.data.next(articles);
      });
    });
  }

  deleteArticle(id: string) {
    this.articleService
      .deleteArticle(id)
      .pipe(switchMap(() => this.articleService.getArticles()))
      .subscribe((articles) => this.articlesDataSource.data.next(articles));
  }
}
