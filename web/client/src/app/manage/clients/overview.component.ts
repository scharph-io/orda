import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ClientsTableComponent } from './clients-table/clients-table.component';
// import { CreateProductDialogComponent } from '../products/create-product-dialog.component';

@Component({
    selector: 'orda-clients-overview',
    template: `
    <div class="toolbar">
      <h2>clients</h2>
      <button mat-fab extended (click)="openClientAddUpdateDialog()">
        <mat-icon>add</mat-icon>
        new_client
      </button>
    </div>
    <orda-clients-table />
  `,
    styles: [
        `
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
        ClientsTableComponent,
    ]
})
export class ClientsOverviewComponent {
  dialog = inject(MatDialog);

  openClientAddUpdateDialog(): void {
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
