import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { Group } from '../../../shared/model/product';

@Component({
  selector: 'orda-groups-overview',
  template: `
    <mat-grid-list cols="7" rowHeight="4:3" gutterSize="1em">
      @if (groups().length === 0) {
        <div>No groups found</div>
        <!-- <mat-grid-tile class="template">
          <div>Create a new group</div>
        </mat-grid-tile> -->
      }
      @for (g of groups(); track g.id) {
        <mat-grid-tile [routerLink]="['/assortment/group', g.id]">
          <div class="group-layout">
            <div class="title">{{ g.name }}</div>
            <div class="desc">{{ g.desc }}</div>
          </div>
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

      .group-layout {
        display: flex;
        flex-direction: column;
        justify-content: center;
        // align-items: center;
        height: 100%;

        .title {
          font-size: 1.5em;
        }

        .desc {
          font-size: 0.9em;
          font-weight: lighter;
        }
      }
    `,
  ],
  imports: [MatGridListModule, RouterModule],
})
export class GroupsOverviewComponent {
  groups = input.required<Group[]>();
}
