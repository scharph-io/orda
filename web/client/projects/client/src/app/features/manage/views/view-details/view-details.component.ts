import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

// Material Imports
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services / Models
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { ViewProduct } from '@orda.core/models/view';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';
import { AssortmentProduct } from '@orda.core/models/assortment';

@Component({
  selector: 'orda-view-details',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NavSubHeaderComponent,
  ],
  template: `
    <div class="flex flex-col h-full gap-2 p-2">
      <orda-nav-sub-header [title]="view.value()?.name ?? 'Loading...'" [showBackButton]="true" />

      <div class="flex items-center gap-4 px-2">
        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="flex-1 max-w-md">
          <mat-label>Filter</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Search products..." #input />
        </mat-form-field>

        <button mat-button color="primary" (click)="save()" [disabled]="isSaving()">
          {{ isSaving() ? 'Saving...' : 'Save' }}
        </button>
      </div>

      <div class="flex-1 overflow-auto rounded-lg border border-gray-200 shadow-sm relative">
        <table mat-table [dataSource]="dataSource" class="w-full">
          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef class="w-12">
              <mat-checkbox
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection.hasValue() && isAllSelected()"
                [indeterminate]="selection.hasValue() && !isAllSelected()"
                color="primary"
              >
              </mat-checkbox>
            </th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(row.id) : null"
                [checked]="selection.isSelected(row.id)"
                color="primary"
              >
              </mat-checkbox>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element" class="font-medium">{{ element.name }}</td>
          </ng-container>

          <ng-container matColumnDef="desc">
            <th mat-header-cell *matHeaderCellDef>Desc</th>
            <td mat-cell *matCellDef="let element">{{ element.desc }}</td>
          </ng-container>

          <ng-container matColumnDef="group">
            <th mat-header-cell *matHeaderCellDef>Group</th>
            <td mat-cell *matCellDef="let element">{{ getGroupName(element.group_id) }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            (click)="selection.toggle(row.id)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          ></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell p-4 text-center text-gray-500" colspan="4">
              @if (input.value) {
                No data matching "{{ input.value }}"
              } @else {
                No products available
              }
            </td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    /* Ensure sticky header sits above content */
    .mat-mdc-header-row {
      background: white;
      z-index: 100;
    }
  `,
})
export class ViewDetailsComponent {
  displayedColumns: string[] = ['select', 'name', 'desc', 'group'];

  private logger = inject(OrdaLogger);
  private viewService = inject(ViewService);
  private assortmentService = inject(AssortmentService);
  private snackBar = inject(MatSnackBar);

  view_id = signal<string>(inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '');
  isSaving = signal(false);

  // Resources
  view = rxResource({
    params: () => this.view_id(),
    stream: ({ params }) => this.viewService.readById(params),
  });

  availableProducts = rxResource({
    stream: () => this.assortmentService.readProducts(),
  });

  viewProducts = rxResource({
    stream: () => this.viewService.getProducts(this.view_id()),
  });

  // Optimized Lookup Map: O(1) access instead of .find()
  private groupsMap = computed(() => {
    const groups = this.assortmentService.groups.value() ?? [];
    return new Map(groups.map((g) => [g.id, g.name]));
  });

  // Material Table & Selection
  // We initialize these once and update them via effects to maintain state stability
  dataSource = new MatTableDataSource<AssortmentProduct>([]);
  selection = new SelectionModel<string>(true, []);

  constructor() {
    // Effect 1: Update Table Data when API returns products
    effect(() => {
      const products = this.availableProducts.value();
      if (products) {
        this.dataSource.data = products;
        // Re-apply filter if data updates
        if (this.dataSource.filter) {
          this.dataSource._updateChangeSubscription();
        }
      }
    });

    // Effect 2: Update Selection when View Products are loaded
    effect(() => {
      const existing = this.viewProducts.value();
      if (existing) {
        this.selection.clear();
        this.selection.select(...existing.map((p) => p.id));
      }
    });

    // Custom Filter Predicate to include Group Name lookup
    this.dataSource.filterPredicate = (data: AssortmentProduct, filter: string) => {
      const groupName = this.getGroupName(data.group_id ?? '').toLowerCase();
      const dataStr = (data.name + (data.desc ?? '') + groupName).toLowerCase();
      return dataStr.includes(filter);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
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
    this.selection.select(...this.dataSource.data.map((s) => s.id));
  }

  getGroupName(id: string | undefined): string {
    if (!id) return '';
    return this.groupsMap().get(id) ?? 'Unknown';
  }

  save() {
    this.isSaving.set(true);
    const viewProductsToSave = this.selection.selected.map(
      (id) => ({ product_id: id }) as Partial<ViewProduct>,
    );

    this.viewService.setProducts(this.view_id(), viewProductsToSave).subscribe({
      next: () => {
        this.logger.debug(
          `Successfully saved ${viewProductsToSave.length} products to view ${this.view_id()}`,
        );
        this.snackBar.open('Saved successfully', 'Close', { duration: 3000 });
        this.isSaving.set(false);
      },
      error: (err) => {
        this.logger.error(`Failed saving products: ${err}`);
        this.snackBar.open('Error saving products', 'Close', {
          duration: 3000,
          panelClass: 'error-snack',
        });
        this.isSaving.set(false);
      },
    });
  }
}
