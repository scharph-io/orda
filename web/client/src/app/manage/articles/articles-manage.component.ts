import { DialogModule } from '@angular/cdk/dialog';
import { CdkTableModule } from '@angular/cdk/table';
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
import { CreateArticleDialogComponent } from './create-article-dialog.component';
import { Category } from '../../shared/model/category';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'orda-articles-manage',
  template: `
    <h2>
      {{ 'article.title' | transloco }}
      <span
        ><button
          mat-raised-button
          color="primary"
          (click)="openArticleAddUpdateDialog()"
        >
          {{ 'article.add' | transloco }}
        </button></span
      >
    </h2>

    @if (dataSource().length == 0) {
      <input
        type="file"
        class="file-input"
        [accept]="'json'"
        (change)="onFileSelected($event)"
        #fileUpload
      />
    }
    @if (dataSource().length !== 0) {
      <table cdk-table [dataSource]="dataSource()" style="margin: 1rem;">
        <ng-container cdkColumnDef="name">
          <th cdk-header-cell *cdkHeaderCellDef>
            {{ 'table.name' | transloco }}
          </th>
          <td cdk-cell *cdkCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <ng-container cdkColumnDef="desc">
          <th cdk-header-cell *cdkHeaderCellDef>
            {{ 'table.desc' | transloco }}
          </th>
          <td cdk-cell *cdkCellDef="let element">{{ element.desc }}</td>
        </ng-container>

        <ng-container cdkColumnDef="price">
          <th cdk-header-cell *cdkHeaderCellDef>
            {{ 'table.price' | transloco }}
          </th>
          <td cdk-cell *cdkCellDef="let element">
            {{ element.price | ordaCurrency }}
          </td>
        </ng-container>

        <ng-container cdkColumnDef="active">
          <th cdk-header-cell *cdkHeaderCellDef>
            {{ 'table.active' | transloco }}
          </th>
          <td cdk-cell *cdkCellDef="let element">
            <mat-slide-toggle
              [checked]="element.active"
              disabled
            ></mat-slide-toggle>
          </td>
        </ng-container>

        <ng-container [matColumnDef]="'actions'">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let element">
            <button
              mat-icon-button
              (click)="openArticleAddUpdateDialog(element)"
            >
              <mat-icon mat-icon-button color="primary">edit </mat-icon>
            </button>
            <button mat-icon-button (click)="deleteArticle(element.id)">
              <mat-icon mat-icon-button color="warn"> delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
        <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
      </table>
    }
  `,
  standalone: true,
  styles: [
    `
      :host {
        overflow-y: scroll;
      }
    `,
  ],
  imports: [
    CdkTableModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    OrdaCurrencyPipe,
    MatSlideToggle,
    TranslocoModule,
  ],
})
export class ArticlesManageComponent {
  category = input.required<Category>();
  dataSource: WritableSignal<Article[]> = signal([]);

  dialog = inject(MatDialog);
  articleService = inject(ArticleService);

  displayedColumns: string[] = ['name', 'desc', 'price', 'active', 'actions'];

  constructor() {
    effect(() => {
      this.articleService
        .getArticlesBy(this.category().id ?? '')
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
        .getArticlesBy(this.category().id ?? '')
        .subscribe((articles) => {
          this.dataSource?.set(articles);
        });
    });
  }

  deleteArticle(id: string) {
    this.articleService
      .deleteArticle(id)
      .pipe(
        switchMap(() =>
          this.articleService.getArticlesBy(this.category().id ?? ''),
        ),
      )
      .subscribe((articles) => this.dataSource?.set(articles));
  }

  onFileSelected(event: any) {
    const file: File = (event.target as HTMLInputElement).files![0];

    if (file) {
      this.readFileContents(file).then((data) => {
        const articles: Article[] = JSON.parse(data);

        console.log(articles);

        this.articleService
          .importArticles(articles, this.category().id ?? '')
          .pipe(
            switchMap(() =>
              this.articleService.getArticlesBy(this.category().id ?? ''),
            ),
          )
          .subscribe((articles) => this.dataSource?.set(articles));
      });
    }
  }

  readFileContents(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      reader.readAsText(file);
    });
  }
}
