import { Component, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'orda-products-manage',
  standalone: true,
  template: `
    <h1>Products Manage</h1>
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        This is the expansion title
      </mat-expansion-panel-header>

      <ng-template matExpansionPanelContent>
        Some deferred content
      </ng-template>
    </mat-expansion-panel>
  `,
  styles: [``],
  imports: [MatExpansionModule],
})
export class ProductsManageComponent {}
