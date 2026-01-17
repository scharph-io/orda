import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  viewChild,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { map, filter, switchMap } from 'rxjs';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

// Shared / Core
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { LayoutService } from '@orda.shared/services/layout.service'; // Adjust path
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';
import { ConfirmDialogComponent } from '@orda.shared/components/confirm-dialog/confirm-dialog.component';

// Features / Services
import { AccountService } from '@orda.features/data-access/services/account/account.service';
import { AccountGroupService } from '@orda.features/data-access/services/account/account-group.service';
import { AccountGroupComponent } from '@orda.features/manage/account/group/group.component';
import { Account } from '@orda.core/models/account';
import { DEPOSIT_VALUES } from '@orda.core/constants';

// Other Dialogs (Assuming they exist or need similar refactor)
import { GroupDepositDialogComponent } from '@orda.features/manage/account/dialogs/group-deposit-dialog/group-deposit.component';
import { AccountDetailDialogComponent } from '@orda.features/manage/account/dialogs/account-detail-dialog/account-detail-dialog.component';
import { AccountCorrectionDialogComponent } from '@orda.features/manage/account/dialogs/account-correction-dialog/account-correction-dialog.component';
import { DepositHistoryDialogComponent } from '@orda.features/manage/account/dialogs/deposit-history-dialog/deposit-history-dialog.component';
import { MatDivider } from '@angular/material/divider';
import { ComponentType } from '@angular/cdk/portal';

export enum HistoryAction {
  Debit = 0,
  Deposit = 1,
  Correction = 2,
  Reset = 3,
}

export enum DepositType {
  Free = 0,
  Cash = 1,
}

@Component({
  selector: 'orda-account',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    OrdaCurrencyPipe,
    NavSubHeaderComponent,
    AccountGroupComponent,
    MatDivider,
  ],
  template: `
    <orda-nav-sub-header title="Kontenverwaltung" [showBackButton]="true" />

    <main class="flex flex-col">
      <div class="mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8 py-2">
        <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms">
          <mat-tab label="Konten">
            <div class="flex flex-col sm:flex-row gap-4 items-center justify-between py-4">
              <div class="flex gap-2 w-full sm:w-auto">
                <button
                  mat-flat-button
                  color="primary"
                  class="h-[56px] !rounded-lg"
                  (click)="selection.selected.length > 0 ? selectionDeposit() : groupDeposit()"
                >
                  @if (selection.selected.length > 0) {
                    <ng-container matButtonIcon>
                      <mat-icon>add_card</mat-icon> Auswahl ({{ selection.selected.length }})
                    </ng-container>
                  } @else {
                    <ng-container matButtonIcon>
                      <mat-icon>group_3</mat-icon> Gruppenbuchung
                    </ng-container>
                  }
                </button>
              </div>

              <div class="flex gap-2 w-full sm:w-auto items-center">
                <mat-form-field
                  appearance="outline"
                  subscriptSizing="dynamic"
                  class="w-full sm:w-64 density-compact"
                >
                  <mat-label>Suchen</mat-label>
                  <mat-icon matPrefix class="text-gray-400 mr-2">search</mat-icon>
                  <input matInput (keyup)="applyFilter($event)" placeholder="Name..." #input />
                  @if (input.value) {
                    <button
                      matSuffix
                      mat-icon-button
                      (click)="input.value = ''; applyFilter($event)"
                    >
                      <mat-icon>close</mat-icon>
                    </button>
                  }
                </mat-form-field>

                @if (!layoutService.isHandset()) {
                  <button
                    mat-flat-button
                    color="primary"
                    class="!h-[48px] !rounded-lg"
                    (click)="create()"
                  >
                    <mat-icon>add</mat-icon> Neu
                  </button>
                }
              </div>
            </div>

            @if (layoutService.isHandset()) {
              <div class="flex flex-col gap-3 pb-24">
                <div class="flex justify-between items-center px-2">
                  <mat-checkbox
                    (change)="$event ? toggleAllRows() : null"
                    [checked]="selection.hasValue() && isAllSelected()"
                    [indeterminate]="selection.hasValue() && !isAllSelected()"
                  >
                    Alle auswählen
                  </mat-checkbox>
                </div>

                @for (row of dataSource().filteredData; track row.id) {
                  <mat-card class="account-card" [class.selected]="selection.isSelected(row)">
                    <div class="flex items-start p-4 gap-3">
                      <div class="pt-1">
                        <mat-checkbox
                          (click)="$event.stopPropagation()"
                          (change)="$event ? selection.toggle(row) : null"
                          [checked]="selection.isSelected(row)"
                        >
                        </mat-checkbox>
                      </div>

                      <div
                        class="flex-1 min-w-0"
                        (click)="info(row)"
                        (keydown)="info(row)"
                        tabindex="0"
                      >
                        <div class="flex justify-between items-start">
                          <div>
                            <h3 class="font-bold text-gray-900">
                              {{ row.lastname }} {{ row.firstname }}
                            </h3>
                            <span
                              class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                            >
                              {{ row.group }}
                            </span>
                          </div>
                          <div class="text-right">
                            <div
                              class="font-bold text-base"
                              [class.text-red-600]="row.credit_balance < 0"
                            >
                              {{ row.credit_balance | currency }}
                            </div>
                            @if (row.main_balance > 0) {
                              <div class="text-xs text-green-600">
                                +{{ row.main_balance | currency }}
                              </div>
                            }
                          </div>
                        </div>
                      </div>

                      <div class="flex-none -mr-2 -mt-2">
                        <button mat-icon-button [matMenuTriggerFor]="menu">
                          <mat-icon>more_vert</mat-icon>
                        </button>

                        <mat-menu #menu="matMenu">
                          <button mat-menu-item (click)="deposit(row)">
                            <mat-icon>add_circle</mat-icon> <span>Aufbuchen</span>
                          </button>
                          <button mat-menu-item (click)="correction(row)">
                            <mat-icon>edit_note</mat-icon> <span>Korrektur</span>
                          </button>
                          <button mat-menu-item (click)="openDepositHistory(row)">
                            <mat-icon>history</mat-icon> <span>Verlauf</span>
                          </button>
                          <mat-divider></mat-divider>
                          <button mat-menu-item (click)="edit(row)">
                            <mat-icon>edit</mat-icon> <span>Bearbeiten</span>
                          </button>
                          <button
                            mat-menu-item
                            (click)="delete(row)"
                            [disabled]="hasMainBalance(row)"
                            class="!text-red-600"
                          >
                            <mat-icon class="!text-red-600">delete</mat-icon> <span>Löschen</span>
                          </button>
                        </mat-menu>
                      </div>
                    </div>
                  </mat-card>
                }
              </div>

              <button mat-fab color="primary" class="fab-bottom-right" (click)="create()">
                <mat-icon>add</mat-icon>
              </button>
            } @else {
              <div class="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                <table mat-table [dataSource]="dataSource()" matSort class="w-full">
                  <ng-container matColumnDef="select">
                    <th mat-header-cell *matHeaderCellDef class="w-12">
                      <mat-checkbox
                        (change)="$event ? toggleAllRows() : null"
                        [checked]="selection.hasValue() && isAllSelected()"
                        [indeterminate]="selection.hasValue() && !isAllSelected()"
                      >
                      </mat-checkbox>
                    </th>
                    <td mat-cell *matCellDef="let row">
                      <mat-checkbox
                        (click)="$event.stopPropagation()"
                        (change)="$event ? selection.toggle(row) : null"
                        [checked]="selection.isSelected(row)"
                      >
                      </mat-checkbox>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                    <td mat-cell *matCellDef="let row" class="font-medium">
                      {{ row.lastname }} {{ row.firstname }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="group">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Gruppe</th>
                    <td mat-cell *matCellDef="let row">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800"
                      >
                        {{ row.group }}
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="credit-balance">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Kontostand</th>
                    <td
                      mat-cell
                      *matCellDef="let row"
                      [class.text-red-600]="row.credit_balance < 0"
                    >
                      {{ row.credit_balance | currency }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef></th>
                    <td mat-cell *matCellDef="let row" class="text-right">
                      <button mat-icon-button [matMenuTriggerFor]="desktopMenu">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #desktopMenu="matMenu">
                        <button mat-menu-item (click)="deposit(row)">
                          <mat-icon>add_circle</mat-icon> <span>Aufbuchen</span>
                        </button>
                        <button mat-menu-item (click)="correction(row)">
                          <mat-icon>edit_note</mat-icon> <span>Korrektur</span>
                        </button>
                        <button mat-menu-item (click)="openDepositHistory(row)">
                          <mat-icon>history</mat-icon> <span>Verlauf</span>
                        </button>
                        <mat-divider></mat-divider>
                        <button mat-menu-item (click)="info(row)">
                          <mat-icon>info</mat-icon> <span>Info</span>
                        </button>
                        <button mat-menu-item (click)="edit(row)">
                          <mat-icon>edit</mat-icon> <span>Bearbeiten</span>
                        </button>
                        <button
                          mat-menu-item
                          (click)="delete(row)"
                          [disabled]="hasMainBalance(row)"
                          class="!text-red-600"
                        >
                          <mat-icon class="!text-red-600">delete</mat-icon> <span>Löschen</span>
                        </button>
                      </mat-menu>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                  <tr
                    mat-row
                    *matRowDef="let row; columns: displayedColumns"
                    [class.bg-blue-50]="selection.isSelected(row)"
                  ></tr>

                  <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell p-4 text-center text-gray-500" colspan="5">
                      Keine Konten gefunden für "{{ input.value }}"
                    </td>
                  </tr>
                </table>
                <mat-paginator
                  [pageSizeOptions]="[10, 25, 50]"
                  showFirstLastButtons
                ></mat-paginator>
              </div>
            }
          </mat-tab>

          <mat-tab label="Gruppen">
            <div class="pt-4">
              <orda-account-groups />
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
      ::ng-deep .density-compact .mat-mdc-form-field-flex {
        height: 48px !important;
        align-items: center !important;
      }
      .fab-bottom-right {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 50;
      }
      .account-card {
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }
      .account-card.selected {
        background-color: #eff6ff;
        border-color: #3b82f6;
      }
    `,
  ],
})
export class AccountComponent extends EntityManager<Account> {
  public layoutService = inject(LayoutService);
  private logger = inject(OrdaLogger);
  private accountService = inject(AccountService);
  public override dialog = inject(MatDialog); // Inject MatDialog directly

  // Resource
  accounts = rxResource({
    stream: () =>
      this.accountService
        .read()
        .pipe(map((res) => res.sort((a, b) => a.lastname.localeCompare(b.lastname)))),
  });

  // Table Configuration
  dataSource = computed(() => {
    const ds = new MatTableDataSource(this.accounts.value() ?? []);
    ds.paginator = this.paginator();
    ds.sort = this.sort();
    return ds;
  });

  selection = new SelectionModel<Account>(true, []);
  displayedColumns = ['select', 'name', 'group', 'credit-balance', 'actions'];

  sort = viewChild(MatSort);
  paginator = viewChild(MatPaginator);

  // --- Selection Logic ---

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource().filteredData.length; // Use filtered data
    return numSelected === numRows && numRows > 0;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource().filteredData);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value ?? '';
    this.dataSource().filter = filterValue.trim().toLowerCase();
    if (this.dataSource().paginator) {
      this.dataSource().paginator?.firstPage();
    }
  }

  // --- CRUD Actions ---

  create() {
    this.openDialog(AccountDialogComponent).subscribe(() => this.accounts.reload());
  }

  edit(acc: Account) {
    this.openDialog(AccountDialogComponent, acc).subscribe(() => this.accounts.reload());
  }

  delete(acc: Account) {
    this.dialogClosed(ConfirmDialogComponent, {
      message: `Konto '${acc.lastname} ${acc.firstname}' wirklich löschen?`,
    })
      .pipe(
        filter(Boolean),
        switchMap(() => this.accountService.delete(acc.id!)),
      )
      .subscribe({
        next: () => this.accounts.reload(),
        error: (err) => this.logger.error(err),
      });
  }

  hasMainBalance(acc: Account): boolean {
    return (acc.main_balance || 0) !== 0;
  }

  // --- Deposit / Actions ---

  deposit(acc: Account) {
    this.openDialog(AccountDepositDialogComponent, acc).subscribe(() => this.accounts.reload());
  }

  selectionDeposit() {
    this.openDialog(MultiAccountDepositDialogComponent, this.selection.selected).subscribe(
      (res) => {
        if (res) {
          this.accounts.reload();
          this.selection.clear();
        }
      },
    );
  }

  groupDeposit() {
    this.openDialog(GroupDepositDialogComponent).subscribe(() => this.accounts.reload());
  }

  correction(acc: Account) {
    this.openDialog(AccountCorrectionDialogComponent, acc).subscribe(() => this.accounts.reload());
  }

  info(acc: Account) {
    this.openDialog(AccountDetailDialogComponent, acc); // Info usually doesn't need reload
  }

  openDepositHistory(acc: Account) {
    this.dialog
      .open(DepositHistoryDialogComponent, {
        width: '600px',
        maxWidth: '95vw',
        data: acc,
      })
      .afterClosed()
      .subscribe(() => this.accounts.reload());
  }

  // Helper to standardise dialog calls without inheritance
  private openDialog<T>(component: ComponentType<T>, data?: unknown) {
    return this.dialog
      .open(component, {
        data,
        width: '400px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .pipe(filter((res) => !!res));
  }
}

// ---------------------------------------------------------
// COMPONENT 2: Account Create/Edit Dialog
// ---------------------------------------------------------

interface AccountForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  group: FormControl<string>;
}

@Component({
  selector: 'orda-account-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TitleCasePipe,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Konto bearbeiten' : 'Neues Konto' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-2">
        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Vorname</mat-label>
            <input matInput formControlName="firstname" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Nachname</mat-label>
            <input matInput formControlName="lastname" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Gruppe</mat-label>
          <mat-select formControlName="group">
            @for (ag of groups.value(); track ag.id) {
              <mat-option [value]="ag.id">{{ ag.name | titlecase }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
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
})
export class AccountDialogComponent {
  private accountService = inject(AccountService);
  private accountGroupService = inject(AccountGroupService);
  private dialogRef = inject(MatDialogRef<AccountDialogComponent>);
  protected data = inject<Account | undefined>(MAT_DIALOG_DATA);

  groups = rxResource({
    stream: () => this.accountGroupService.read(),
    defaultValue: [],
  });

  form = new FormGroup<AccountForm>({
    firstname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    group: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    if (this.data) {
      this.form.patchValue({
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        group: this.data.groupid,
      });
    }
  }

  get isEditMode() {
    return !!this.data?.id;
  }

  submit() {
    if (this.form.invalid) return;
    const { firstname, lastname, group } = this.form.getRawValue();
    const payload = { firstname, lastname, groupid: group };

    const action$ = this.isEditMode
      ? this.accountService.update(this.data!.id!, { id: this.data!.id!, ...payload })
      : this.accountService.create(payload);

    action$.subscribe((res) => this.dialogRef.close(res));
  }
}

// ---------------------------------------------------------
// COMPONENT 3: Single Deposit Dialog
// ---------------------------------------------------------

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    OrdaCurrencyPipe,
  ],
  template: `
    <h2 mat-dialog-title>Buchung</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-2">
        <mat-button-toggle-group
          formControlName="amountToggle"
          class="flex flex-wrap"
          (change)="onToggleChange($event)"
        >
          @for (val of DEPOSIT_VALUES; track val) {
            <mat-button-toggle [value]="val">{{ val * 100 | currency }}</mat-button-toggle>
          }
          <mat-button-toggle [value]="-1">Eigen</mat-button-toggle>
        </mat-button-toggle-group>

        @if (isCustomAmount()) {
          <mat-form-field appearance="outline">
            <mat-label>Betrag in €</mat-label>
            <input matInput type="number" formControlName="customAmount" />
          </mat-form-field>
        }

        <mat-form-field appearance="outline">
          <mat-label>Kommentar</mat-label>
          <input matInput formControlName="reason" placeholder="z.B. Barzahlung" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Abbrechen</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="form.invalid">
        Buchen
      </button>
    </mat-dialog-actions>
  `,
})
export class AccountDepositDialogComponent {
  private accountService = inject(AccountService);
  private dialogRef = inject(MatDialogRef<AccountDepositDialogComponent>);
  private data = inject<Account>(MAT_DIALOG_DATA);

  DEPOSIT_VALUES = DEPOSIT_VALUES;
  isCustomAmount = computed(() => this.form.controls.amountToggle.value === -1);

  form = new FormGroup({
    amountToggle: new FormControl<number | null>(null, Validators.required),
    customAmount: new FormControl<number | null>(null),
    reason: new FormControl('Barzahlung', Validators.required),
  });

  onToggleChange(event: MatButtonToggleChange) {
    if (event.value !== -1) {
      this.form.controls.customAmount.setValue(null);
    }
  }

  submit() {
    const { amountToggle, customAmount, reason } = this.form.getRawValue();
    const finalAmount = amountToggle === -1 ? customAmount : amountToggle;

    if (!finalAmount || finalAmount <= 0) return;

    this.accountService
      .deposit(this.data.id!, {
        amount: finalAmount * 100, // Convert to cents
        history_action: HistoryAction.Deposit,
        deposit_type: DepositType.Free,
        reason: reason || '',
      })
      .subscribe((res) => this.dialogRef.close(res));
  }
}

// ---------------------------------------------------------
// COMPONENT 4: Multi Deposit Dialog
// ---------------------------------------------------------

interface MultiDepositForm {
  amountToggle: FormControl<number | null>;
  customAmount: FormControl<number | null>;
  reason: FormControl<string>;
}

@Component({
  selector: 'orda-multi-account-deposit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    OrdaCurrencyPipe,
  ],
  template: `
    <h2 mat-dialog-title>Mehrfachbuchung ({{ data.length }} Konten)</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-2 min-w-[300px]">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700" for="amountToggle"
            >Betrag auswählen</label
          >
          <mat-button-toggle-group formControlName="amountToggle" class="flex flex-wrap w-full">
            @for (val of DEPOSIT_VALUES; track val) {
              <mat-button-toggle [value]="val" class="flex-1">
                {{ val * 100 | currency }}
              </mat-button-toggle>
            }
            <mat-button-toggle [value]="-1" class="flex-1">Eigen</mat-button-toggle>
          </mat-button-toggle-group>
        </div>

        @if (isCustomAmount) {
          <mat-form-field appearance="outline" class="animate-fade-in">
            <mat-label>Betrag in €</mat-label>
            <input matInput type="number" formControlName="customAmount" placeholder="0.00" />
            <span matTextSuffix>€</span>
            @if (form.controls.customAmount.hasError('required')) {
              <mat-error>Betrag ist erforderlich</mat-error>
            }
            @if (form.controls.customAmount.hasError('min')) {
              <mat-error>Betrag muss positiv sein</mat-error>
            }
          </mat-form-field>
        }

        <mat-form-field appearance="outline">
          <mat-label>Kommentar</mat-label>
          <input matInput formControlName="reason" placeholder="z.B. Barzahlung" />
          @if (form.controls.reason.hasError('required')) {
            <mat-error>Kommentar ist erforderlich</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Abbrechen</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="form.invalid">
        Buchen
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .animate-fade-in {
        animation: fadeIn 0.2s ease-in-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class MultiAccountDepositDialogComponent implements OnInit {
  private accountService = inject(AccountService);
  private dialogRef = inject(MatDialogRef<MultiAccountDepositDialogComponent>);
  private destroyRef = inject(DestroyRef);

  public data = inject<Account[]>(MAT_DIALOG_DATA);

  protected readonly DEPOSIT_VALUES = DEPOSIT_VALUES;

  protected form = new FormGroup<MultiDepositForm>({
    amountToggle: new FormControl(null, [Validators.required]),
    customAmount: new FormControl(null),
    reason: new FormControl('Barzahlung', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit() {
    this.setupValidationLogic();
  }

  get isCustomAmount(): boolean {
    return this.form.controls.amountToggle.value === -1;
  }

  private setupValidationLogic() {
    this.form.controls.amountToggle.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((toggleValue) => {
        const customCtrl = this.form.controls.customAmount;

        if (toggleValue === -1) {
          // Enable custom input validation
          customCtrl.setValidators([Validators.required, Validators.min(0.01)]);
          customCtrl.enable();
        } else {
          // Reset and disable custom input
          customCtrl.clearValidators();
          customCtrl.setValue(null);
          customCtrl.disable();
        }
        customCtrl.updateValueAndValidity();
      });
  }

  submit() {
    if (this.form.invalid) return;

    const { amountToggle, customAmount, reason } = this.form.getRawValue();

    // Determine final amount (Toggle value OR Custom value)
    const finalAmountEuro = amountToggle === -1 ? customAmount : amountToggle;

    if (!finalAmountEuro || finalAmountEuro <= 0) return;

    this.accountService
      .depositMany({
        account_ids: this.data.map((a) => a.id!),
        amount: Math.round(finalAmountEuro * 100), // Convert to Cents safely
        history_action: HistoryAction.Deposit,
        deposit_type: DepositType.Free,
        reason: reason,
      })
      .subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => console.error('Error processing multi-deposit', err),
      });
  }
}
