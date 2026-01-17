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
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

// Services / Models
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { ViewProduct } from '@orda.core/models/view';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';
import { AssortmentProduct } from '@orda.core/models/assortment';
import { LayoutService } from '@orda.shared/services/layout.service';

@Component({
  selector: 'orda-view-details',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    NavSubHeaderComponent,
  ],
  template: `
    <orda-nav-sub-header [title]="view.value()?.name ?? 'Loading...'" [showBackButton]="true" />

    <div class="mx-auto max-w-7xl top-0  p-4 flex gap-4 items-center">
      <mat-form-field appearance="outline" subscriptSizing="dynamic" class="flex-1 density-compact">
        <mat-label>Suchen...</mat-label>
        <mat-icon matPrefix class="text-gray-400 mr-2">search</mat-icon>
        <input matInput (keyup)="applyFilter($event)" placeholder="Produkte filtern" #input />
        @if (input.value) {
          <button matSuffix mat-icon-button (click)="input.value = ''; applyFilter($event)">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      @if (!layoutService.isHandset()) {
        <button
          mat-flat-button
          color="primary"
          class="!h-[50px] !rounded-lg"
          (click)="save()"
          [disabled]="isSaving()"
        >
          <mat-icon>save</mat-icon>
          {{ isSaving() ? 'Saving...' : 'Speichern' }}
        </button>
      }
    </div>

    <div class="mx-auto max-w-7xl px-3 py-1 sm:px-6 lg:px-8">
      @if (layoutService.isHandset()) {
        <div class="flex flex-col gap-3 pb-20">
          <div class="flex justify-between items-center px-2 py-1">
            <span class="text-sm text-gray-500">{{ selection.selected.length }} ausgewählt</span>
            <button mat-button (click)="toggleAllRows()">
              {{ isAllSelected() ? 'Auswahl aufheben' : 'Alle auswählen' }}
            </button>
          </div>

          @for (product of dataSource.filteredData; track product.id) {
            <mat-card
              class="card-interactive"
              [class.selected-card]="selection.isSelected(product.id)"
              (click)="selection.toggle(product.id)"
            >
              <div class="flex items-start p-4 gap-3">
                <div class="pt-1">
                  <mat-checkbox
                    (click)="$event.stopPropagation()"
                    (change)="$event ? selection.toggle(product.id) : null"
                    [checked]="selection.isSelected(product.id)"
                    color="primary"
                  >
                  </mat-checkbox>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <h3 class="font-bold text-gray-900 truncate pr-2">{{ product.name }}</h3>
                    <span
                      class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap"
                    >
                      {{ getGroupName(product.group_id) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 line-clamp-2 mt-1">
                    {{ product.desc || 'Keine Beschreibung' }}
                  </p>
                </div>
              </div>
            </mat-card>
          }
          @if (dataSource.filteredData.length === 0) {
            <div class="text-center p-8 text-gray-400">Keine Produkte gefunden.</div>
          }
        </div>

        <button
          mat-fab
          color="primary"
          class="fab-bottom-right"
          (click)="save()"
          [disabled]="isSaving()"
        >
          <mat-icon>save</mat-icon>
        </button>
      } @else {
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table mat-table [dataSource]="dataSource" class="w-full">
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef class="w-16 text-center">
                <mat-checkbox
                  (change)="$event ? toggleAllRows() : null"
                  [checked]="selection.hasValue() && isAllSelected()"
                  [indeterminate]="selection.hasValue() && !isAllSelected()"
                  color="primary"
                >
                </mat-checkbox>
              </th>
              <td mat-cell *matCellDef="let row" class="text-center">
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
              <th mat-header-cell *matHeaderCellDef>Beschreibung</th>
              <td mat-cell *matCellDef="let element" class="text-gray-500">{{ element.desc }}</td>
            </ng-container>

            <ng-container matColumnDef="group">
              <th mat-header-cell *matHeaderCellDef>Gruppe</th>
              <td mat-cell *matCellDef="let element">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800"
                >
                  {{ getGroupName(element.group_id) }}
                </span>
              </td>
            </ng-container>

            <tr
              mat-header-row
              *matHeaderRowDef="displayedColumns; sticky: true"
              class="bg-gray-50 border-b"
            ></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              (click)="selection.toggle(row.id)"
              class="hover:bg-blue-50/50 cursor-pointer transition-colors border-b last:border-0"
              [class.bg-blue-50]="selection.isSelected(row.id)"
            ></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell p-8 text-center text-gray-500" colspan="4">
                Keine Ergebnisse für "{{ input.value }}"
              </td>
            </tr>
          </table>
        </div>
      }
    </div>
  `,
  styles: [
    `
      /* Material Density Override */
      ::ng-deep .density-compact .mat-mdc-form-field-flex {
        height: 50px !important;
        align-items: center !important;
      }

      /* Mobile specific styles */
      .fab-bottom-right {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 50;
      }

      .card-interactive {
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .selected-card {
        background-color: #eff6ff; /* blue-50 */
        border-color: #3b82f6; /* blue-500 */
      }

      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class ViewDetailsComponent {
  displayedColumns: string[] = ['select', 'name', 'desc', 'group'];

  private logger = inject(OrdaLogger);
  private viewService = inject(ViewService);
  private assortmentService = inject(AssortmentService);
  private snackBar = inject(MatSnackBar);
  protected layoutService = inject(LayoutService);

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

  private groupsMap = computed(() => {
    const groups = this.assortmentService.groups.value() ?? [];
    return new Map(groups.map((g) => [g.id, g.name]));
  });

  dataSource = new MatTableDataSource<AssortmentProduct>([]);
  selection = new SelectionModel<string>(true, []);

  constructor() {
    effect(() => {
      const products = this.availableProducts.value();
      if (products) {
        this.dataSource.data = products;
        if (this.dataSource.filter) this.dataSource._updateChangeSubscription();
      }
    });

    effect(() => {
      const existing = this.viewProducts.value();
      if (existing) {
        this.selection.clear();
        this.selection.select(...existing.map((p) => p.id));
      }
    });

    this.dataSource.filterPredicate = (data: AssortmentProduct, filter: string) => {
      const groupName = this.getGroupName(data.group_id ?? '').toLowerCase();
      const dataStr = (data.name + (data.desc ?? '') + groupName).toLowerCase();
      return dataStr.includes(filter);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // Important: Use filteredData so 'Select All' respects the search filter
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows && numRows > 0;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    // Select all currently visible (filtered) items
    this.selection.select(...this.dataSource.filteredData.map((s) => s.id));
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
        this.logger.debug(`Saved ${viewProductsToSave.length} products`);
        this.snackBar.open('Gespeichert!', undefined, { duration: 2000 });
        this.isSaving.set(false);
      },
      error: (err) => {
        this.logger.error(`Failed saving: ${err}`);
        this.snackBar.open('Fehler beim Speichern', 'OK', { panelClass: 'error-snack' });
        this.isSaving.set(false);
      },
    });
  }
}
