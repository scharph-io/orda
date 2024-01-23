import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ArticleGroup } from '../article';
import { ScrollingModule } from '@angular/cdk/scrolling';

/**
 * @title Tab group with aligned labels
 */
@Component({
  selector: 'orda-ordergrid',
  standalone: true,
  imports: [MatGridListModule, CommonModule, ScrollingModule],
  template: `
    <div class="container">
      <mat-grid-list cols="4" rowHeight="1:1" gutterSize="0.5rem">
        @for (article of group?.articles; track article) {
        <mat-grid-tile>{{ article.name }}</mat-grid-tile>
        }
      </mat-grid-list>
    </div>
  `,
  styles: [
    `
      mat-grid-list {
        overflow: auto;
      }
      .container {
        margin: 0.5rem;
        height: calc(99vh - 120px);
        overflow: auto;
      }
      mat-grid-tile {
        background: lightblue;
      }
    `,
  ],
})
export class OrderGridComponent {
  @Input() group?: ArticleGroup;
  constructor() {}
}
