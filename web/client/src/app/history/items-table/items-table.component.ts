import { Component, OnInit, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TransactionItem } from '../../shared/model/transaction';
import { TranslocoModule } from '@jsverse/transloco';
import { OrdaCurrencyPipe } from '../../shared/currency.pipe';

@Component({
  selector: 'orda-items-table',
  standalone: true,
  template: `<table mat-table [dataSource]="items()" class="mat-elevation-z8">
    <!-- Position Column -->
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef>#</th>
      <td mat-cell *matCellDef="let element">{{ element.id }}</td>
    </ng-container>

    <!-- Desc Column -->
    <ng-container matColumnDef="desc">
      <th mat-header-cell *matHeaderCellDef>
        {{ 'description' | transloco }}
      </th>
      <td mat-cell *matCellDef="let element" [title]="element.product_id">
        {{ element.description }}
      </td>
    </ng-container>

    <!-- Price Column -->
    <ng-container matColumnDef="price">
      <th mat-header-cell *matHeaderCellDef>
        {{ 'unitprice' | transloco }}
      </th>
      <td mat-cell *matCellDef="let element">
        {{ element.price | ordaCurrency }}
      </td>
    </ng-container>

    <!-- Quantity Column -->
    <ng-container matColumnDef="qty">
      <th mat-header-cell *matHeaderCellDef>
        {{ 'quantity' | transloco }}
      </th>
      <td mat-cell *matCellDef="let element">{{ element.qty }}</td>
    </ng-container>

    <ng-container matColumnDef="total">
      <th mat-header-cell *matHeaderCellDef>
        {{ 'total' | transloco }}
      </th>
      <td mat-cell *matCellDef="let element">
        {{ element.qty * element.price | ordaCurrency }}
      </td>
    </ng-container>

    <!-- Actions Column -->
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef>Actions</th>
      <!-- TODO -->
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
  </table>`,
  styles: ``,
  imports: [MatTableModule, TranslocoModule, OrdaCurrencyPipe],
})
export class ItemsTableComponent implements OnInit {
  items = input.required<TransactionItem[]>();

  displayedColumns: string[] = ['position', 'desc', 'price', 'qty', 'total'];

  constructor() {}

  ngOnInit(): void {
    // Component initialization logic goes here
  }
}
