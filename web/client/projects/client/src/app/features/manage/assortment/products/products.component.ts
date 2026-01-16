import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop'; // Import toSignal

// Models & Utils
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { AssortmentProduct } from '@orda.core/models/assortment';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, switchMap } from 'rxjs';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card'; // New Import
import { MatDividerModule } from '@angular/material/divider'; // New Import
import { MatMenuModule } from '@angular/material/menu'; // New Import

// Components
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { DepositDialogComponent } from './deposit-dialog.component';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutService } from '@orda.shared/services/layout.service';

@Component({
  selector: 'orda-assortment-view-details',
  standalone: true, // Assuming standalone based on imports
  imports: [
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    OrdaCurrencyPipe,
    RouterModule,
    FormsModule,
    NavSubHeaderComponent,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatIcon,
    MatSlideToggle,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  template: `
    <orda-nav-sub-header [title]="group.value()?.name ?? ''" [showBackButton]="true" />

    <main class="mx-auto max-w-7xl px-3 py-1 sm:px-6 lg:px-8">
      @if (group.value(); as g) {
        <div
          class="flex flex-col sm:flex-row gap-4 mb-6 items-stretch sm:items-center justify-between"
        >
          <div class="flex-none">
            <button
              mat-flat-button
              class="w-full sm:w-auto transition-colors duration-200"
              (click)="openDepositDialog()"
              [class.!bg-green-700]="g.deposit?.active"
              [class.!text-white]="g.deposit?.active"
            >
              @if (g.deposit?.active) {
                <mat-icon class="mr-1">check_circle</mat-icon>
              } @else {
                <mat-icon class="mr-1">add_circle_outline</mat-icon>
              }
              Pfand
              @if (g.deposit?.active) {
                {{ g.deposit!.price | currency }}
              }
            </button>
          </div>

          <div
            class="flex flex-col sm:flex-row gap-3 flex-grow sm:flex-grow-0 sm:justify-end items-center"
          >
            <mat-form-field appearance="outline" class="w-full sm:w-72 density-compact">
              <mat-label>Suchen</mat-label>
              <mat-icon matPrefix class="text-gray-400 mr-2">search</mat-icon>
              <input matInput [(ngModel)]="filterValue" placeholder="Name, Preis..." />
              @if (filterValue()) {
                <button matSuffix mat-icon-button (click)="filterValue.set('')">
                  <mat-icon>close</mat-icon>
                </button>
              }
            </mat-form-field>

            @if (!layoutService.isHandset()) {
              <button
                mat-flat-button
                color="primary"
                class="h-[56px] !rounded-lg"
                (click)="create()"
              >
                <mat-icon>add</mat-icon> Produkt
              </button>
            }
          </div>
        </div>

        @if (layoutService.isHandset()) {
          <div class="flex flex-col gap-3 pb-20">
            @for (row of dataSource().filteredData; track row.id) {
              <mat-card class="product-card border border-gray-200 shadow-sm">
                <div class="flex justify-between items-start p-4">
                  <div class="flex-1 min-w-0 pr-4">
                    <h3 class="text-lg font-bold text-gray-900 truncate">{{ row.name }}</h3>
                    <p class="text-sm text-gray-500 line-clamp-2">{{ row.desc }}</p>
                    <div class="mt-2 flex items-center gap-2">
                      <span
                        class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {{ row.price | currency }}
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-col items-end gap-1">
                    <button mat-icon-button [matMenuTriggerFor]="menu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-slide-toggle
                      class="scale-75 origin-right"
                      [(ngModel)]="row.active"
                      (change)="toggleProduct(row.id)"
                      color="primary"
                    >
                    </mat-slide-toggle>
                  </div>
                </div>

                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="edit(row)">
                    <mat-icon>edit</mat-icon> <span>Bearbeiten</span>
                  </button>
                  <button mat-menu-item (click)="duplicate(row)">
                    <mat-icon>content_copy</mat-icon> <span>Duplizieren</span>
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="delete(row)" class="!text-red-600">
                    <mat-icon class="!text-red-600">delete</mat-icon> <span>Löschen</span>
                  </button>
                </mat-menu>
              </mat-card>
            }
            @if (dataSource().filteredData.length === 0) {
              <div class="flex flex-col items-center justify-center p-8 text-gray-400">
                <mat-icon class="text-4xl h-10 w-10 mb-2">search_off</mat-icon>
                <p>Keine Produkte gefunden.</p>
              </div>
            }
          </div>

          <button mat-fab color="primary" class="fab-bottom-right" (click)="create()">
            <mat-icon>add</mat-icon>
          </button>
        } @else {
          @if (dataSource().data.length > 0) {
            <div class="rounded-lg border border-gray-200 overflow-hidden">
              <table mat-table [dataSource]="dataSource()" matSort class="w-full">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                  <td mat-cell *matCellDef="let row" class="font-medium">{{ row.name }}</td>
                </ng-container>

                <ng-container matColumnDef="desc">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Beschreibung</th>
                  <td mat-cell *matCellDef="let row" class="text-gray-500">{{ row.desc }}</td>
                </ng-container>

                <ng-container matColumnDef="price">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Preis</th>
                  <td mat-cell *matCellDef="let row">{{ row.price | currency }}</td>
                </ng-container>

                <ng-container matColumnDef="active">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Aktiv</th>
                  <td mat-cell *matCellDef="let row">
                    <mat-slide-toggle
                      [(ngModel)]="row.active"
                      (change)="toggleProduct(row.id)"
                      color="primary"
                    />
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let row" style="text-align: right;">
                    <button mat-icon-button (click)="duplicate(row)" matTooltip="Duplizieren">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                    <button mat-icon-button (click)="edit(row)" matTooltip="Bearbeiten">
                      <mat-icon class="text-gray-500">edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="delete(row)" matTooltip="Löschen">
                      <mat-icon class="text-red-500">delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr
                  mat-header-row
                  *matHeaderRowDef="displayedColumns; sticky: true"
                  class="bg-gray-50"
                ></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                  class="hover:bg-gray-50 transition-colors"
                ></tr>

                <tr class="mat-row" *matNoDataRow>
                  <td class="mat-cell p-4 text-center text-gray-500" colspan="5">
                    Keine Ergebnisse für "{{ filterValue() }}"
                  </td>
                </tr>
              </table>
            </div>
          } @else {
            <div class="flex flex-col items-center justify-center p-8 text-gray-400">
              <mat-icon class="text-4xl h-10 w-10 mb-2">search_off</mat-icon>
              <p>Keine Produkte gefunden.</p>
            </div>
          }
        }
      } @else {
        <div class="p-8 flex justify-center">
          <div class="animate-pulse text-gray-400">Lade Daten...</div>
        </div>
      }
    </main>
  `,
  styles: [
    `
      /* Material Override for Compact Input */
      ::ng-deep .density-compact .mat-mdc-form-field-flex {
        height: 56px !important; /* Matches Button Height */
        align-items: center !important;
      }

      .fab-bottom-right {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 50;
      }
    `,
  ],
})
export class AssortmentProductsComponent extends EntityManager<AssortmentProduct> {
  displayedColumns: string[] = ['name', 'desc', 'price', 'active', 'actions'];

  assortmentService = inject(AssortmentService);
  private logger = inject(OrdaLogger);
  private route = inject(ActivatedRoute);
  protected layoutService = inject(LayoutService);

  // State Signals
  group_id = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');
  filterValue = signal<string>(''); // Reactive filter state

  // Resources
  group = rxResource({
    params: () => this.group_id(),
    stream: ({ params }) => this.assortmentService.readGroupById(params),
  });

  products = rxResource({
    stream: () => this.assortmentService.readProducts(this.group_id()),
  });

  dataSource = computed(() => {
    const ds = new MatTableDataSource(this.products.value() ?? []);
    // Apply initial filter if exists
    ds.filter = this.filterValue().trim().toLowerCase();
    // Custom predicate if needed, otherwise default string match is fine
    return ds;
  });

  constructor() {
    super();
    // Effect: Update table filter whenever filterValue signal changes
    effect(() => {
      const val = this.filterValue().trim().toLowerCase();
      // We must access the data source inside the effect or derived logic
      this.dataSource().filter = val;

      if (this.dataSource().paginator) {
        this.dataSource().paginator?.firstPage();
      }
    });
  }

  // --- CRUD Actions ---

  public override create(): void {
    this.dialogClosed(AssortmentProductDialogComponent, { group: this.group_id() }).subscribe(() =>
      this.products.reload(),
    );
  }

  public override delete(p: AssortmentProduct): void {
    this.assortmentService
      .readProductById(p.id!)
      .pipe(
        switchMap((prod) =>
          this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
            ConfirmDialogComponent,
            { message: `Produkt "${prod.name}" wirklich löschen?` },
          ),
        ),
        filter((confirmed) => !!confirmed),
        switchMap(() => this.assortmentService.removeProduct(p.id!)),
      )
      .subscribe({
        next: () => this.products.reload(),
        error: (err) => this.logger.error(err),
      });
  }

  public override edit(p: AssortmentProduct): void {
    this.dialogClosed(AssortmentProductDialogComponent, {
      group: this.group_id(),
      data: p,
    }).subscribe(() => this.products.reload());
  }

  public duplicate(p: AssortmentProduct): void {
    this.dialogClosed(AssortmentProductDialogComponent, {
      group: this.group_id(),
      data: p,
      duplicate: true,
    }).subscribe(() => this.products.reload());
  }

  // --- Helpers ---

  openDepositDialog() {
    this.dialogClosed(DepositDialogComponent, {
      groupId: this.group_id(),
      deposit: this.group.value()?.deposit,
    }).subscribe(() => this.group.reload());
  }

  protected toggleProduct(id: string) {
    this.assortmentService.toggleProduct(id).subscribe(() => this.products.reload());
  }
}
interface ProductForm {
  name: FormControl<string>;
  desc: FormControl<string>;
  price: FormControl<number | undefined>;
  active: FormControl<boolean>;
}

// 2. Define strict type for Input Data
interface DialogData {
  group: string;
  data?: AssortmentProduct;
  duplicate: boolean;
}

@Component({
  selector: 'orda-assortment-product-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSlideToggle,
  ],
  template: `
    <h2 mat-dialog-title>
      @if (data.duplicate) {
        Dupliziere "{{ data.data?.name }}"
      } @else {
        {{ isEditMode ? 'Produkt bearbeiten' : 'Neues Produkt' }}
      }
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="product-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="z.B. Cola" />
          @if (form.controls.name.hasError('minlength')) {
            <mat-error>Mindestens 3 Zeichen</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Beschreibung</mat-label>
          <input matInput formControlName="desc" placeholder="z.B. 0,33l Flasche" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Preis</mat-label>
          <input type="number" matInput formControlName="price" placeholder="0.00" />
          <span matTextSuffix>€</span>
        </mat-form-field>

        <mat-slide-toggle formControlName="active"> Produkt aktiv </mat-slide-toggle>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Abbrechen</button>
      <button
        mat-flat-button
        color="primary"
        (click)="submit()"
        [disabled]="form.invalid || form.pristine"
      >
        Speichern
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .product-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-top: 0.5rem;
        min-width: 300px;
      }
    `,
  ],
})
export class AssortmentProductDialogComponent implements OnInit {
  protected form = new FormGroup<ProductForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),
    desc: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),
    price: new FormControl(undefined, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    active: new FormControl(false, { nonNullable: true }),
  });

  assortmentService = inject(AssortmentService);
  dialogRef = inject(MatDialogRef<AssortmentProductDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  // Helper to determine title and logic
  get isEditMode(): boolean {
    return !!this.data.data && !this.data.duplicate;
  }

  ngOnInit() {
    if (this.data.data) {
      this.form.patchValue({
        name: this.data.data.name,
        desc: this.data.data.desc,
        price: this.data.data.price / 100, // Convert Cents to Euro
        active: this.data.data.active,
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.getPayload();

    if (this.isEditMode) {
      this.assortmentService
        .updateProduct(this.data.data!.id, payload)
        .subscribe(this.handleResponse);
    }
    // Case 2: Create New OR Duplicate (Add)
    else {
      this.assortmentService.addProducts(this.data.group, [payload]).subscribe(this.handleResponse);
    }
  }

  /**
   * Centralizes data transformation (Strings -> Trim, Euro -> Cents)
   */
  private getPayload() {
    const raw = this.form.getRawValue();
    return {
      name: raw.name.trim(),
      desc: raw.desc.trim(),
      price: Math.round((raw.price ?? 0) * 100), // Ensure integer Cents
      active: raw.active,
    };
  }

  private handleResponse = {
    next: (res: unknown) => this.dialogRef.close(res),
    error: (err: unknown) => console.error(err),
  };
}
