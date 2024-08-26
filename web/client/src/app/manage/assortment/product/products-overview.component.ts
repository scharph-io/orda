import { DialogModule } from '@angular/cdk/dialog';
import { MatTableModule } from '@angular/material/table';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  WritableSignal,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

import { TranslocoModule } from '@jsverse/transloco';
import { CreateProductDialogComponent } from './create-product-dialog.component';
import { Product } from '../../../shared/model/product';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';
import { AssortmentService } from '../../../shared/services/assortment.service';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MessageService,
  Severity,
} from '../../../shared/services/message.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'orda-products-overview',
  template: `
    <div class="toolbar">
      <h2>{{ 'product.title' | transloco }}</h2>
      <div style="display: flex; gap:0.5em; align-items: center">
        <button mat-flat-button (click)="openProductAddUpdateDialog()">
          <mat-icon>add</mat-icon>
          {{ 'product.new' | transloco }}
        </button>

        <button
          mat-icon-button
          [matMenuTriggerFor]="menu"
          aria-label="Example icon-button with a menu"
        >
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item disabled>
            <mat-icon>download</mat-icon>
            <span>Import TODO</span>
          </button>
          <button mat-menu-item disabled>
            <mat-icon>upload</mat-icon>
            <span>Export TODO</span>
          </button>

          @if (dataSource().length !== 0) {
            <button mat-menu-item (click)="deleteAll()">
              <mat-icon>delete</mat-icon>
              {{ 'product.delete' | transloco }}
            </button>
          }
        </mat-menu>
      </div>
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
            <!-- {{ 'table.active' | transloco }} -->
          </th>
          <td mat-cell *matCellDef="let element">
            <mat-slide-toggle
              [checked]="element.active"
              (change)="changed(element, $event)"
            ></mat-slide-toggle>
          </td>
        </ng-container>

        <ng-container [matColumnDef]="'actions'">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let element">
            <button
              mat-icon-button
              (click)="openProductAddUpdateDialog(element)"
              title="Edit"
            >
              <mat-icon mat-icon-button color="primary">edit</mat-icon>
            </button>
            <button
              mat-icon-button
              (click)="deleteProduct(element.id)"
              title="Delete"
            >
              <mat-icon mat-icon-button color="warn">delete</mat-icon>
            </button>
            <button
              mat-icon-button
              (click)="openProductAddUpdateDialog(element, true)"
              title="Duplicate"
            >
              <mat-icon mat-icon-button color="primary"
                >control_point_duplicate</mat-icon
              >
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    } @else {
      <div class="container">
        <p>No products available</p>
      </div>
    }
  `,
  standalone: true,
  styles: [
    `
      table {
        width: 100%;
      }

      th {
        font-weight: bold;
      }

      .mat-mdc-table {
        background-color: transparent;
      }

      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 1em;
        flex-wrap: wrap;
      }
      :host {
        overflow-y: scroll;
      }
    `,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    TranslocoModule,
    OrdaCurrencyPipe,
    MatMenuModule,
  ],
})
export class ProductsOverviewComponent implements OnInit {
  products = input.required<Product[]>();
  group = input.required<string>();
  dataSource: WritableSignal<Product[]> = signal([]);

  assortmentService = inject(AssortmentService);
  messageService = inject(MessageService);

  dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'desc', 'price', 'active', 'actions'];

  constructor() {}

  ngOnInit(): void {
    this.dataSource.set(this.products() ?? []);
  }

  deleteAll() {
    this.assortmentService
      .deleteProductsByGroupId$(this.group() ?? '')
      .pipe()
      .subscribe((_) => this.dataSource?.set([]));
  }

  openProductAddUpdateDialog(
    product?: Product,
    duplicate: boolean = false,
  ): void {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      data: { product, groupId: this.group(), duplicate },
      minWidth: '40vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed', result);

      if (!result) {
        return;
      }

      this.messageService.send({
        title: this.genProductMsg(result.product, result.action),
        severity: Severity.INFO,
      });

      this.assortmentService
        .getProductsByGroupId$(this.group() ?? '')
        .subscribe((products) => {
          this.dataSource.set(products);
        });
    });
  }

  deleteProduct(id: string) {
    this.assortmentService
      .deleteProduct$(id)
      .pipe(
        switchMap(() =>
          this.assortmentService.getProductsByGroupId$(this.group() ?? ''),
        ),
      )
      .subscribe((products) => {
        this.messageService.send({ title: 'Product deleted' });
        this.dataSource?.set(products);
      });
  }

  changed(p: Product, ev: MatSlideToggleChange) {
    this.assortmentService
      .updateProduct$(p.id ?? '', {
        ...p,
        active: ev.checked,
      })
      .pipe(
        catchError((err) => {
          this.messageService.send({
            title: 'Product updated failed',
            severity: Severity.ERROR,
          });
          return EMPTY;
        }),
      )
      .subscribe((res) => {
        this.messageService.send({ title: 'Product updated' });
      });
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

  genProductMsg(p: Product, action: string): string {
    let msg = '';
    if (p.desc === undefined) {
      msg = `${p.name}`;
    } else {
      msg = `${p.name} (${p.desc})`;
    }
    switch (action) {
      case 'duplicate':
      case 'create':
        return `Product ${msg} added`;
      case 'edit':
        return `Product ${msg} updated`;
      default:
        return '';
    }
  }
}
