import { Component, inject } from '@angular/core';
import { filter, switchMap } from 'rxjs';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

// Shared
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { AssortmentGroup } from '@orda.core/models/assortment';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';
import { LayoutService } from '@orda.shared/services/layout.service';

@Component({
  selector: 'orda-assortment-groups',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    TitleCasePipe,
    RouterModule,
    NavSubHeaderComponent,
  ],
  template: `
    <orda-nav-sub-header title="Sortiment" [showBackButton]="true" />

    <main class="max-w-7xl mx-auto px-3 py-3 sm:px-4 lg:px-8">
      <div class="mb-6 flex justify-between items-center">
        @if (!layoutService.isHandset()) {
          <button mat-flat-button color="primary" class="h-[56px] !rounded-lg" (click)="create()">
            <mat-icon>add</mat-icon> Gruppe
          </button>
        }
      </div>

      @let groups = assortmentService.groups.value() ?? [];

      @if (groups.length === 0) {
        <div class="flex flex-col items-center justify-center py-16 text-gray-500 gap-4">
          <mat-icon class="text-6xl h-16 w-16 text-gray-300">category</mat-icon>
          <p>Noch keine Gruppen vorhanden.</p>
          <button mat-stroked-button color="primary" (click)="create()">Jetzt anlegen</button>
        </div>
      } @else {
        @if (layoutService.isHandset()) {
          <div class="flex flex-col gap-3 pb-20">
            @for (group of groups; track group.id) {
              <mat-card class="group-card shadow-sm border border-gray-200">
                <div class="flex justify-between items-start p-4">
                  <a
                    [routerLink]="[group.id]"
                    class="flex-1 min-w-0 pr-4 group cursor-pointer no-underline text-inherit"
                  >
                    <h3
                      class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                    >
                      {{ group.name | titlecase }}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                      {{ group.desc || 'Keine Beschreibung' }}
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
                      <button mat-menu-item (click)="edit(group)">
                        <mat-icon>edit</mat-icon> <span>Bearbeiten</span>
                      </button>
                      <button mat-menu-item (click)="delete(group)" class="!text-red-600">
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
                  <th scope="col" class="px-6 py-4 font-semibold text-right w-24">Aktionen</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100">
                @for (group of groups; track group.id) {
                  <tr class="hover:bg-blue-50/30 transition-colors group relative">
                    <td class="px-6 py-4 font-medium text-gray-900">
                      <a
                        [routerLink]="[group.id]"
                        class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer block w-full h-full font-semibold"
                      >
                        {{ group.name | titlecase }}
                      </a>
                    </td>

                    <td class="px-6 py-4 text-gray-500">
                      {{ group.desc || '-' }}
                    </td>

                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2  transition-opacity">
                        <button
                          mat-icon-button
                          (click)="edit(group)"
                          matTooltip="Bearbeiten"
                          class="!text-gray-600 hover:bg-gray-100"
                        >
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button
                          mat-icon-button
                          (click)="delete(group)"
                          matTooltip="Löschen"
                          class="!text-red-500 hover:bg-red-50"
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
      .group-card {
        border-radius: 12px;
        /* Improve touch target on mobile */
        touch-action: manipulation;
      }
    `,
  ],
})
export class AssortmentGroupsComponent extends EntityManager<AssortmentGroup> {
  assortmentService = inject(AssortmentService);
  logger = inject(OrdaLogger);
  protected layoutService = inject(LayoutService);

  constructor() {
    super();
  }

  create() {
    this.dialogClosed(AssortmentGroupDialogComponent, {}).subscribe(() =>
      this.assortmentService.groups.reload(),
    );
  }

  edit(ag: AssortmentGroup) {
    this.dialogClosed(AssortmentGroupDialogComponent, ag).subscribe(() =>
      this.assortmentService.groups.reload(),
    );
  }

  delete(ag: AssortmentGroup) {
    this.assortmentService
      .readGroupById(ag.id ?? '')
      .pipe(
        switchMap((group) =>
          this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
            ConfirmDialogComponent,
            { message: `Soll "${group.name}" wirklich gelöscht werden?` },
          ),
        ),
        filter((res) => !!res),
        switchMap(() => this.assortmentService.deleteGroup(ag.id)),
      )
      .subscribe({
        next: () => this.assortmentService.groups.reload(),
        error: (err) => this.logger.error(err),
      });
  }
}

// --- DIALOG COMPONENT ---

interface GroupForm {
  name: FormControl<string>;
  desc: FormControl<string>;
}

@Component({
  selector: 'orda-assortment-group-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule, // Includes Title, Content, Actions
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ isEditMode ? 'Gruppe bearbeiten' : 'Neue Gruppe' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="group-form flex flex-col gap-4 pt-2 min-w-[300px]">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="z.B. Getränke" />
          @if (form.controls.name.hasError('required')) {
            <mat-error>Name ist erforderlich</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Beschreibung</mat-label>
          <input matInput formControlName="desc" placeholder="Optionale Beschreibung" />
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

  styles: `
    .group-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 0.5rem;
      min-width: 300px;
    }
  `,
})
export class AssortmentGroupDialogComponent {
  private assortmentService = inject(AssortmentService);
  private dialogRef = inject(MatDialogRef<AssortmentGroupDialogComponent>);
  protected data = inject<AssortmentGroup | undefined>(MAT_DIALOG_DATA);

  protected form = new FormGroup<GroupForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),
    desc: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        desc: this.data.desc,
      });
    }
  }

  get isEditMode(): boolean {
    return !!this.data?.id;
  }

  submit() {
    if (this.form.invalid) return;

    const { name, desc } = this.form.getRawValue();
    const payload = { name: name.trim(), desc: desc?.trim() ?? '' };

    const action$ = this.isEditMode
      ? this.assortmentService.updateGroup(this.data!.id!, payload)
      : this.assortmentService.createGroup(payload);

    action$.subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => console.error(err),
    });
  }
}
