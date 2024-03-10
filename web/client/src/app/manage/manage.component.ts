import { Component, inject } from '@angular/core';
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

// Example ??? https://www.codeproject.com/Articles/5290817/Build-Angular-data-table-with-CRUD-operations-and
@Component({
  template: `
    <div class="container">
      <h1>Manage</h1>

      <button mat-raised-button color="primary" (click)="openAddDialog()">
        Add
      </button>

      <table cdk-table [dataSource]="dataSource">
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
            <button mat-icon-button (click)="edit(element)">
              <mat-icon mat-icon-button color="primary">edit</mat-icon>
            </button>
            <button mat-icon-button (click)="delete(element.uuid)">
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
  dataSource = new ArticleDataSource();

  dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'desc', 'price', 'active', 'actions'];
  constructor() {}

  edit(element: Article) {
    console.log('edit', element);
  }

  delete(id: string) {
    console.log('delete', id);
  }

  openAddDialog(): void {
    this.dialog.open(CreateArticleDialogComponent);

    const dialogRef = this.dialog.open(CreateArticleDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
