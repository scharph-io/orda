import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Client } from '../../../shared/model/clients';

const CLIENTS: Client[] = [
  {
    id: '1',
    firstName: 'Hans',
    lastName: 'Wurst',
    email: '',
    phone: '123-456-7890',
    balance: 1000,
  },
  {
    id: '2',
    firstName: 'Franz',
    lastName: 'Jaeger',
    email: '',
    phone: '123-456-7890',
    balance: 1000,
  },
  {
    id: '3',
    firstName: 'Sepp',
    lastName: 'Maier',
    email: '',
    phone: '123-456-7890',
    balance: -1000,
  },
  {
    id: '4',
    firstName: 'Alfred',
    lastName: 'Wurst',
    email: '',
    phone: '123-456-7890',
    balance: 10000,
  },
  {
    id: '5',
    firstName: 'Albert',
    lastName: 'Jaeger',
    email: '',
    phone: '123-456-7890',
    balance: -2000,
  },
  {
    id: '6',
    firstName: 'Rudi',
    lastName: 'Maier',
    email: '',
    phone: '123-456-7890',
    balance: 6000,
  },
];

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'orda-clients-table',
  styleUrl: 'clients-table.component.scss',
  templateUrl: 'clients-table.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class ClientsTableComponent implements AfterViewInit {
  // displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  displayedColumns: string[] = ['firstName', 'lastName', 'balance'];
  dataSource: MatTableDataSource<Client>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor() {
    // Create 100 users
    // const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(CLIENTS);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
