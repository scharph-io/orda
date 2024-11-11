import {
  Component,
  Inject,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { TranslocoModule } from '@jsverse/transloco';
import { Product } from '../../../shared/model/product';
import { AssortmentService } from '../../../shared/services/assortment.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { RouterModule } from '@angular/router';
import { View } from '../../../shared/model/view';
import { ViewService } from '../../../shared/services/view.service';

//  https://material.angular.io/components/table/overview#selection
@Component({
  selector: 'orda-create-product-dialog',
  template: `
    <h2 mat-dialog-title>
      {{ 'product.append' | transloco }}
    </h2>
    <mat-dialog-content>
      <!-- @for (product of products(); track product) {
        {{ product.name }} {{ product.group }} <br />
      } -->

      @if (dataSource.data.length === 0) {
        <div
          style="display: flex; flex-flow: row; justify-content: space-between; align-items: center;"
        >
          {{ 'table.no-data' | transloco }}
          <button
            mat-button
            [routerLink]="['/assortment']"
            (click)="closeDialog()"
          >
            {{ 'assortment.title' | transloco }}
          </button>
        </div>
      } @else {
        <mat-form-field>
          <mat-label>Filter</mat-label>
          <input
            matInput
            (keyup)="applyFilter($event)"
            [placeholder]="'search' | transloco"
            #input
          />
        </mat-form-field>

        <table
          mat-table
          [dataSource]="dataSource"
          class="example-container mat-elevation-z8"
        >
          <!-- Name Column -->
          <ng-container matColumnDef="name" sticky>
            <th mat-header-cell *matHeaderCellDef>
              {{ 'table.name' | transloco }}
            </th>
            <td mat-cell *matCellDef="let element">
              {{ element.name }}
              @if (element.desc) {
                ({{ element.desc }})
              }
            </td>
          </ng-container>

          <!-- Group Column -->
          <ng-container matColumnDef="group">
            <th mat-header-cell *matHeaderCellDef>
              {{ 'table.group' | transloco }}
            </th>
            <td mat-cell *matCellDef="let element">{{ element.group }}</td>
          </ng-container>

          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef>
              <mat-checkbox
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection.hasValue() && isAllSelected()"
                [indeterminate]="selection.hasValue() && !isAllSelected()"
                [aria-label]="checkboxLabel()"
              >
              </mat-checkbox>
            </th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(row) : null"
                [checked]="selection.isSelected(row)"
                [aria-label]="checkboxLabel(row)"
              >
              </mat-checkbox>
            </td>
          </ng-container>

          <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns; sticky: true"
          ></tr>
          <tr
            mat-row
            [style.height.em]="3"
            *matRowDef="let row; columns: displayedColumns"
          ></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4">
              No data matching the filter "{{ input.value }}"
            </td>
          </tr>
        </table>
      }
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close>
        {{ 'dialog.cancel' | transloco }}
      </button>
      <button
        mat-button
        [disabled]="dataSource.data.length === 0"
        style="background-color: greenyellow;"
        (click)="append()"
      >
        {{ 'dialog.append' | transloco }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        display: flex;
        flex-direction: column;
      }

      // .example-container {
      //   height: 400px;
      //   overflow: auto;
      // }

      table {
        width: 100%;
      }

      th {
        font-weight: bold;
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    TranslocoModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    OrdaCurrencyPipe,
    RouterModule,
  ],
})
export class ProductAppendDialogComponent implements OnInit {
  assortment = inject(AssortmentService);
  viewService = inject(ViewService);
  // dataSource: WritableSignal<Product[]> = signal([]);
  dataSource = new MatTableDataSource<Product>([]);
  selection = new SelectionModel<Product>(true, []);

  // displayedColumns: string[] = ['name', 'desc', 'price', 'group', 'appended'];

  displayedColumns: string[] = ['select', 'name', 'group'];

  dialogRef = inject(MatDialogRef<ProductAppendDialogComponent>);

  view = inject<View>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log(this.view);

    this.assortment
      .getProducts$()
      .subscribe((res) => (this.dataSource.data = res));
  }

  append() {
    this.selection.selected.forEach((product) => {
      console.log(product);
    });

    const data = this.selection.selected
      .map((p) => p.id)
      .filter((p) => p !== undefined) as string[];

    this.viewService
      .appendProductsToView$(this.view.id, data)
      .subscribe((res) => {
        console.log(res);
        this.dialogRef.close(res);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.filteredData);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }
}
