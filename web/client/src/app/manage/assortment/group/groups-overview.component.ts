import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { Group } from '../../../shared/model/product';

@Component({
  selector: 'orda-groups-overview',
  template: `
    <mat-grid-list cols="5" rowHeight="4:3" gutterSize="1em">
      @if (groups().length === 0) {
        <div>No groups found</div>
        <!-- <mat-grid-tile class="template">
          <div>Create a new group</div>
        </mat-grid-tile> -->
      }
      @for (g of groups(); track g.id) {
        <mat-grid-tile [routerLink]="['/assortment/group', g.id]">
          <div>{{ g.name }}</div>
          <div>{{ g.desc }}</div>
          @if (g.deposit && g.deposit > 0) {
            <div>{{ g.deposit }}</div>
          }
        </mat-grid-tile>
      }
    </mat-grid-list>
  `,
  standalone: true,
  styles: [
    `
      mat-grid-list {
        margin: 0 1em;
      }

      mat-grid-tile {
        background: grey;
        border: 1px solid black;
      }

      .template {
        background: lightgrey;
        border: 5px dotted black;
      }
    `,
  ],
  imports: [MatGridListModule, RouterModule],
})
export class GroupsOverviewComponent {
  groups = input.required<Group[]>();
}
