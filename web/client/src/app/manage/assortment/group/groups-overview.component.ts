import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { GroupDetailsDialogComponent } from './group-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'orda-groups-overview',
  template: `
    <mat-grid-list cols="5" rowHeight="4:3" gutterSize="1em">
      <mat-grid-tile [routerLink]="['/assortment/group', id]"
        >Getraenke</mat-grid-tile
      >
      <mat-grid-tile [routerLink]="['/assortment/group', id]"
        >Speisen</mat-grid-tile
      >
      <mat-grid-tile [routerLink]="['/assortment/group', id]"
        >Tabak</mat-grid-tile
      >
      <mat-grid-tile [routerLink]="['/assortment/group', id]"
        >Tickets</mat-grid-tile
      >
      <mat-grid-tile [routerLink]="['/assortment/group', id]"
        >Getraenke</mat-grid-tile
      >
    </mat-grid-list>
  `,
  standalone: true,
  styles: [
    `
      mat-grid-list {
        margin: 0 1em;
      }

      mat-grid-tile {
        background: white;
        border: 1px solid black;
      }
    `,
  ],
  imports: [
    DialogModule,
    MatGridListModule,
    GroupDetailsDialogComponent,
    RouterModule,
  ],
})
export class GroupsOverviewComponent {
  public id = 12;
}
