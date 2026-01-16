import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for template
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, filter, switchMap, of } from 'rxjs';

// Services & Utils
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { RoleService } from '@orda.features/data-access/services/role.service';
import { View } from '@orda.core/models/view';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';
import { LayoutService } from '@orda.shared/services/layout.service';

@Component({
  selector: 'orda-view-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    RouterModule,
    NavSubHeaderComponent,
  ],
  template: `
    <orda-nav-sub-header title="Ansichten" [showBackButton]="true" />

    <main class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex justify-between items-center">
        @if (!isHandset()) {
          <button mat-flat-button color="primary" class="h-[56px] !rounded-lg" (click)="create()">
            <mat-icon>add</mat-icon> Ansicht
          </button>
        }
      </div>

      @let views = viewService.entityResource.value() ?? [];

      @if (views.length === 0) {
        <div class="flex flex-col items-center justify-center py-16 text-gray-500 gap-4">
          <mat-icon class="text-6xl h-16 w-16 text-gray-300">view_quilt</mat-icon>
          <p>Noch keine Ansichten vorhanden.</p>
          <button mat-stroked-button color="primary" (click)="create()">Jetzt anlegen</button>
        </div>
      } @else {
        @if (isHandset()) {
          <div class="flex flex-col gap-3 pb-20">
            @for (view of views; track view.id) {
              <mat-card class="view-card shadow-sm border border-gray-200">
                <div class="flex justify-between items-start p-4">
                  <a
                    [routerLink]="[view.id]"
                    [state]="{ name: view.name }"
                    class="flex-1 min-w-0 pr-4 group cursor-pointer no-underline text-inherit"
                  >
                    <h3
                      class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate"
                    >
                      {{ view.name }}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                      {{ view.desc || 'Keine Beschreibung' }}
                    </p>
                    <div class="mt-3 flex items-center text-blue-600 text-sm font-medium">
                      Ansehen <mat-icon class="text-sm h-4 w-4 ml-1">arrow_forward</mat-icon>
                    </div>
                  </a>

                  <div class="flex flex-col -mr-2 -mt-2">
                    <button mat-icon-button [matMenuTriggerFor]="menu">
                      <mat-icon class="text-gray-500">more_vert</mat-icon>
                    </button>
                    <mat-menu #menu="matMenu">
                      <button mat-menu-item (click)="edit(view)">
                        <mat-icon>edit</mat-icon> <span>Bearbeiten</span>
                      </button>
                      <button mat-menu-item (click)="delete(view)" class="!text-red-600">
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
          <div class="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
            <table class="min-w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-gray-50 border-b border-gray-200 text-gray-900">
                <tr>
                  <th scope="col" class="px-6 py-4 font-semibold">Name</th>
                  <th scope="col" class="px-6 py-4 font-semibold">Beschreibung</th>
                  <th scope="col" class="px-6 py-4 font-semibold text-right w-32">Aktionen</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100">
                @for (view of views; track view.id) {
                  <tr class="hover:bg-blue-50/30 transition-colors group">
                    <td class="px-6 py-4 font-medium text-gray-900">
                      <a
                        [routerLink]="[view.id]"
                        [state]="{ name: view.name }"
                        class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer block w-full h-full font-semibold"
                      >
                        {{ view.name }}
                      </a>
                    </td>

                    <td class="px-6 py-4 text-gray-500">
                      {{ view.desc || '-' }}
                    </td>

                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2 transition-opacity">
                        <button
                          mat-icon-button
                          (click)="edit(view)"
                          class="!text-gray-600 hover:bg-gray-100"
                          matTooltip="Bearbeiten"
                        >
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button
                          mat-icon-button
                          (click)="delete(view)"
                          class="!text-red-600 hover:bg-red-50"
                          matTooltip="Löschen"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
      .fab-bottom-right {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 50;
      }
      .view-card {
        border-radius: 12px;
        touch-action: manipulation;
      }
    `,
  ],
})
export class ViewListComponent extends EntityManager<View> {
  viewService = inject(ViewService);
  logger = inject(OrdaLogger);
  protected layoutService = inject(LayoutService);
  protected isHandset = this.layoutService.isHandset;
  constructor() {
    super();
  }

  create() {
    this.dialogClosed(ViewListDialogComponent, {}).subscribe(() =>
      this.viewService.entityResource.reload(),
    );
  }

  edit(v: View) {
    this.dialogClosed(ViewListDialogComponent, v).subscribe(() =>
      this.viewService.entityResource.reload(),
    );
  }

  delete(v: View) {
    this.viewService
      .readById(v.id ?? '')
      .pipe(
        switchMap((view) =>
          this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
            ConfirmDialogComponent,
            { message: `Soll "${view.name}" wirklich gelöscht werden?` },
          ),
        ),
        filter((res) => !!res),
        switchMap(() => this.viewService.delete(v.id)),
      )
      .subscribe({
        next: () => this.viewService.entityResource.reload(),
        error: (err) => this.logger.error(err),
      });
  }
}

// --- DIALOG COMPONENT ---

interface ViewForm {
  name: FormControl<string>;
  desc: FormControl<string | null>;
  roles: FormControl<string[]>;
}

@Component({
  selector: 'orda-view-list-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ isEditMode ? 'Ansicht bearbeiten' : 'Neue Ansicht' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="view-form flex flex-col gap-4 pt-2 min-w-[300px]">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="z.B. Kantine" />
          @if (form.controls.name.hasError('required')) {
            <mat-error>Name ist erforderlich</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Beschreibung</mat-label>
          <input matInput formControlName="desc" placeholder="z.B. Heimspiel" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Berechtigte Rollen</mat-label>
          <mat-select formControlName="roles" multiple>
            @for (role of roleService.entityResource.value(); track role.id) {
              <mat-option [value]="role.id">{{ role.name }}</mat-option>
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
export class ViewListDialogComponent {
  private viewService = inject(ViewService);
  public roleService = inject(RoleService);
  private dialogRef = inject(MatDialogRef<ViewListDialogComponent>);
  public data = inject<View | undefined>(MAT_DIALOG_DATA); // Inject data safely

  // Resource for fetching existing View details
  protected viewDetails = rxResource({
    params: () => this.data?.id,
    stream: ({ params: id }) => {
      if (!id) return of(null);
      return this.viewService.readById(id).pipe(map((view) => view.roles.map((r) => r.id)));
    },
  });

  protected form = new FormGroup<ViewForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    }),
    desc: new FormControl('', { validators: [Validators.maxLength(40)] }),
    roles: new FormControl([], { nonNullable: true }),
  });

  constructor() {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        desc: this.data.desc,
      });
    }

    // Reactively update roles
    effect(() => {
      // Use inject(effect) or define effect in constructor body
      const existingRoleIds = this.viewDetails.value();
      if (existingRoleIds) {
        this.form.controls.roles.setValue(existingRoleIds);
      }
    });
  }

  get isEditMode(): boolean {
    return !!this.data?.id;
  }

  submit() {
    if (this.form.invalid) return;

    const { name, desc, roles } = this.form.getRawValue();
    const commonData = { name, desc: desc ?? '' };

    const action$ = this.isEditMode
      ? this.viewService.update(this.data!.id, commonData).pipe(map(() => this.data!.id))
      : this.viewService.create({ ...commonData, deposit: 100 }).pipe(map((res) => res.id));

    action$.pipe(switchMap((viewId) => this.viewService.setRoles(viewId, roles))).subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => console.error('Error saving view', err),
    });
  }
}
