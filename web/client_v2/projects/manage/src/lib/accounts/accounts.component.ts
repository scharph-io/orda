import { SelectionModel } from '@angular/cdk/collections';
import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface Account {
  name: string;
  group: string;
  balance: number;
}

const ELEMENT_DATA: Account[] = [
  { name: 'John Doe', group: 'Admin', balance: 1000 },
  { name: 'Jane Doe', group: 'User', balance: 2000 },
  { name: 'Jim Doe', group: 'User', balance: 3000 },
  { name: 'Jill Doe', group: 'Admin', balance: 4000 },
];

@Component({
  selector: 'lib-accounts',
  imports: [
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    JsonPipe,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent {
  displayedColumns: string[] = ['select', 'name', 'group', 'balance'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<Account>(true, []);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
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

  openDialog() {
    console.log('open dialog');
  }
}
