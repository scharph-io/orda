import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GroupsOverviewComponent } from './group/groups-overview.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductDialogComponent } from '../products/create-product-dialog.component';
import { CreateGroupDialogComponent } from './group/create-group-dialog.component';

@Component({
  selector: 'orda-assortment-overview',
  template: `
    <div class="toolbar">
      <h2>assortment</h2>
      <button mat-fab extended (click)="openGroupAddUpdateDialog()">
        <mat-icon>add</mat-icon>
        new_group
      </button>
    </div>
    <orda-groups-overview />
  `,
  standalone: true,
  styles: [
    `
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 1em;
      }
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    DialogModule,
    GroupsOverviewComponent,
    CreateGroupDialogComponent,
  ],
})
export class AssortmentOverviewComponent {
  dialog = inject(MatDialog);
  test() {
    console.log('test');
  }

  openGroupAddUpdateDialog(): void {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      //   data: { product, categoryId: this.category().id },
      minWidth: '30rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      //   this.productService
      //     .getProductsBy(this.category().id ?? '')
      //     .subscribe((products) => {
      //       this.dataSource?.set(products);
      //     });
    });
  }
}
