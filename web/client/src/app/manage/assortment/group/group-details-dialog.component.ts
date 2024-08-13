import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MatListModule } from '@angular/material/list';
import { ProductsOverviewComponent } from '../product/products-overview.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'orda-group-details',
  template: `
    <div class="container">
      <div class="header">
        <h3>Group Details</h3>
        <!-- <button
          (click)="dialogRef.close()"
          mat-icon-button
          aria-label="Example icon button with a open in new tab icon"
        >
          <mat-icon>close</mat-icon>
        </button> -->
      </div>
      <div class="content">
        <orda-products-overview />
      </div>
      <!-- <div class="footer">
        <button mat-raised-button>Basic</button>
        <button mat-raised-button>Basic</button>
      </div> -->
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
      }
      .header {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        margin: 0.5em 0.5em;
      }

      .content {
        flex-grow: 1;
      }

      .footer {
        margin: 0.5em 0.5em;
        display: flex;
        justify-content: flex-end;
        gap: 1em;
      }
    `,
  ],
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    ProductsOverviewComponent,
  ],
})
export class GroupDetailsDialogComponent implements OnInit {
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log('Test ID:', params['id']);
    });
  }
  constructor() {}
}
