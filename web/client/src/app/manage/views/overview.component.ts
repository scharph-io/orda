import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
// import { CreateProductDialogComponent } from '../products/create-product-dialog.component';

@Component({
  selector: 'orda-details-overview',
  template: `
    <div class="toolbar">
      <h2>views</h2>
      <button mat-fab extended (click)="openViewAddUpdateDialog()">
        <mat-icon>add</mat-icon>
        new_view
      </button>
    </div>
    <mat-grid-list cols="5" rowHeight="4:3" gutterSize="1em">
      <mat-grid-tile [routerLink]="['/views', id]">Kiosk</mat-grid-tile>
      <mat-grid-tile [routerLink]="['/views', id]">Eingang</mat-grid-tile>
      <mat-grid-tile [routerLink]="['/views', id]">Seidlbar</mat-grid-tile>
    </mat-grid-list>
  `,
  standalone: true,
  styles: [
    `
      mat-grid-tile {
        background: grey;
        border: 1px solid red;
      }
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 1em;
      }
    `,
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    DialogModule,
    MatGridListModule,
    RouterModule,
  ],
})
export class ViewsOverviewComponent {
  dialog = inject(MatDialog);

  id = 13;

  openViewAddUpdateDialog(): void {
    // const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
    //   //   data: { product, categoryId: this.category().id },
    //   minWidth: '30rem',
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    //   //   this.productService
    //   //     .getProductsBy(this.category().id ?? '')
    //   //     .subscribe((products) => {
    //   //       this.dataSource?.set(products);
    //   //     });
    // });
  }
}
