import { DialogModule } from '@angular/cdk/dialog';
import { MatTableModule } from '@angular/material/table';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TranslocoModule } from '@jsverse/transloco';
import { CreateProductDialogComponent } from './create-product-dialog.component';
import { Product } from '../../../shared/model/product';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';

@Component({
  selector: 'orda-products-overview',
  template: `
    <div class="toolbar">
      <h2>products</h2>
      <button mat-fab extended (click)="openProductAddUpdateDialog()">
        <mat-icon>add</mat-icon>
        new_product
      </button>
    </div>

    <!-- @if (dataSource().length == 0) {
      <input
        type="file"
        class="file-input"
        [accept]="'json'"
        (change)="onFileSelected($event)"
        #fileUpload
      />
    } -->
    @if (dataSource().length !== 0) {
      <table mat-table [dataSource]="dataSource()" style="margin: 1rem;">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>
            {{ 'table.name' | transloco }}
          </th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <ng-container matColumnDef="desc">
          <th mat-header-cell *matHeaderCellDef>
            {{ 'table.desc' | transloco }}
          </th>
          <td mat-cell *matCellDef="let element">{{ element.desc }}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>
            {{ 'table.price' | transloco }}
          </th>
          <td mat-cell *matCellDef="let element">
            {{ element.price | ordaCurrency }}
          </td>
        </ng-container>

        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef>
            {{ 'table.active' | transloco }}
          </th>
          <td mat-cell *matCellDef="let element">
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
              (click)="openProductAddUpdateDialog(element)"
            >
              <mat-icon mat-icon-button color="primary">edit </mat-icon>
            </button>
            <button mat-icon-button (click)="deleteProduct(element.id)">
              <mat-icon mat-icon-button color="warn"> delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    }
  `,
  standalone: true,
  styles: [
    `
      table {
        width: 100%;
      }

      .mat-mdc-table {
        background-color: transparent;
      }

      .mat-column-price {
        color: red;
      }

      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 1em;
      }
      :host {
        overflow-y: scroll;
      }
    `,
  ],
  imports: [
    MatTableModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    TranslocoModule,
    OrdaCurrencyPipe,
  ],
})
export class ProductsOverviewComponent {
  //   category = input.required<Category>();
  // dataSource: WritableSignal<Product[]> = signal([]);
  dataSource: WritableSignal<Product[]> = signal([
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
    { name: 'test', price: 100, active: true, groupId: '1' },
  ]);

  dialog = inject(MatDialog);
  //   productService = inject(ProductService);

  displayedColumns: string[] = ['name', 'desc', 'price', 'active', 'actions'];

  //   constructor() {
  //     effect(() => {
  //       this.productService
  //         .getProductsBy(this.category().id ?? '')
  //         .subscribe((data) => {
  //           this.dataSource?.set(data);
  //         });
  //     });
  //   }

  openProductAddUpdateDialog(product?: any): void {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      // data: { product, groupId: this.category().id },
      minWidth: '90vw',
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

  deleteProduct(id: string) {
    //     this.productService
    //       .deleteProduct(id)
    //       .pipe(
    //         switchMap(() =>
    //           this.productService.getProductsBy(this.category().id ?? ''),
    //         ),
    //       )
    //       .subscribe((products) => this.dataSource?.set(products));
  }

  //   onFileSelected(event: any) {
  //     const file: File = (event.target as HTMLInputElement).files![0];

  //     if (file) {
  //       this.readFileContents(file).then((data) => {
  //         const products: Product[] = JSON.parse(data);

  //         console.log(products);

  //         this.productService
  //           .importProducts(products, this.category().id ?? '')
  //           .pipe(
  //             switchMap(() =>
  //               this.productService.getProductsBy(this.category().id ?? ''),
  //             ),
  //           )
  //           .subscribe((products) => this.dataSource?.set(products));
  //       });
  //     }
  //   }

  //   readFileContents(file: File): Promise<string> {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();

  //       reader.onload = () => {
  //         resolve(reader.result as string);
  //       };

  //       reader.onerror = () => {
  //         reader.abort();
  //         reject(new DOMException('Problem parsing input file.'));
  //       };

  //       reader.readAsText(file);
  //     });
  //   }
}
