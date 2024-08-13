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

import { TranslocoModule } from '@jsverse/transloco';
import { CreateProductDialogComponent } from './create-product-dialog.component';

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

        <ng-container cdkColumnDef="position">
          <th cdk-header-cell *cdkHeaderCellDef>
            {{ 'table.position' | transloco }}
          </th>
          <td cdk-cell *cdkCellDef="let element">
            {{ element.position }}
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

        <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
        <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
      </table>
    } -->
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
    TranslocoModule,
  ],
})
export class ProductsOverviewComponent {
  //   category = input.required<Category>();
  //   dataSource: WritableSignal<Product[]> = signal([]);

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

  openProductAddUpdateDialog(): void {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      // data: { product, categoryId: this.category().id },
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

  //   deleteProduct(id: string) {
  //     this.productService
  //       .deleteProduct(id)
  //       .pipe(
  //         switchMap(() =>
  //           this.productService.getProductsBy(this.category().id ?? ''),
  //         ),
  //       )
  //       .subscribe((products) => this.dataSource?.set(products));
  //   }

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
