import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AssortmentGroup } from '@orda.core/models/assortment';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, switchMap } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { RouterModule } from '@angular/router';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';

@Component({
  selector: 'orda-assortment-groups',
  imports: [MatButtonModule, MatIcon, TitleCasePipe, RouterModule, NavSubHeaderComponent],
  template: `
    <orda-nav-sub-header title="Sortiment" [showBackButton]="true" />

    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div class="mb-6">
        <button
          mat-button
          color="primary"
          class="!font-bold !text-blue-600 !px-0 hover:!bg-transparent hover:underline"
          (click)="create()"
        >
          Neu
        </button>
      </div>

      @let groups = assortmentService.groups.value() ?? [];

      @if (groups.length === 0) {
        <div class="text-center py-10 text-gray-500">
          Noch keine Gruppen vorhanden.
          <button mat-button color="primary" (click)="create()">Jetzt anlegen</button>
        </div>
      } @else {
        <div class="overflow-hidden bg-white rounded-lg border border-gray-100 shadow-sm">
          <table class="min-w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 border-b border-gray-200 text-gray-900">
              <tr>
                <th scope="col" class="px-4 py-3 font-semibold">Name</th>
                <th scope="col" class="px-4 py-3 font-semibold">Beschreibung</th>
                <th scope="col" class="px-4 py-3 font-semibold text-right w-24"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              @for (group of groups; track group.id) {
                <tr class="hover:bg-gray-50 transition-colors group">
                  <td class="px-4 py-3 font-medium text-gray-900">
                    <a
                      [routerLink]="[group.id]"
                      routerLinkActive="text-blue-800 font-bold"
                      class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer block w-full h-full"
                    >
                      {{ group.name | titlecase }}
                    </a>
                  </td>

                  <td class="px-4 py-3 text-gray-500">
                    {{ group.desc }}
                  </td>

                  <td class="px-4 py-3 text-right">
                    <div
                      class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        mat-icon-button
                        (click)="delete(group)"
                        class="!text-red-600 hover:bg-red-50 !w-8 !h-8 leading-none"
                        title="Löschen"
                      >
                        <mat-icon class="!text-[1.25rem]">delete</mat-icon>
                      </button>

                      <button
                        mat-icon-button
                        (click)="edit(group)"
                        class="!text-gray-600 hover:bg-gray-100 !w-8 !h-8 leading-none"
                        title="Bearbeiten"
                      >
                        <mat-icon class="!text-[1.25rem]">edit</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </main>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
})
export class AssortmentGroupsComponent extends EntityManager<AssortmentGroup> {
  assortmentService = inject(AssortmentService);
  logger = inject(OrdaLogger);

  constructor() {
    super();
  }

  create() {
    this.dialogClosed<AssortmentGroupDialogComponent, undefined, AssortmentGroup>(
      AssortmentGroupDialogComponent,
      undefined,
    ).subscribe(() => this.assortmentService.groups.reload());
  }

  edit(ag: AssortmentGroup) {
    this.dialogClosed<AssortmentGroupDialogComponent, AssortmentGroup, AssortmentGroup>(
      AssortmentGroupDialogComponent,
      ag,
    ).subscribe(() => this.assortmentService.groups.reload());
  }

  delete(ag: AssortmentGroup) {
    this.assortmentService
      .readGroupById(ag.id ?? '')
      .pipe(
        switchMap((assortmentGroup) =>
          this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
            ConfirmDialogComponent,
            {
              message: `Soll "${assortmentGroup.name}" wirklich gelöscht werden?`,
            },
          ),
        ),
      )
      .pipe(
        filter((res) => res),
        switchMap(() => this.assortmentService.deleteGroup(ag.id)),
      )
      .subscribe({
        next: () => {
          this.assortmentService.groups.reload();
        },
        error: (err) => this.logger.error(err),
      });
  }
}

@Component({
  selector: 'orda-assortment-group-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DialogTemplateComponent,
    MatLabel,
    MatFormFieldModule,
    MatInput,
  ],
  template: `
    <orda-dialog-template
      [customTemplate]="template"
      [form]="formGroup"
      (submitClick)="submit()"
    ></orda-dialog-template>

    <ng-template #template>
      <form [formGroup]="formGroup" class="flex flex-col gap-4 min-w-[350px]">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="z.B. Getränke" />
          @if (formGroup.get('name')?.hasError('required')) {
            <mat-error>Name ist erforderlich</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Beschreibung</mat-label>
          <input matInput formControlName="desc" placeholder="Optionale Beschreibung" />
        </mat-form-field>
      </form>
    </ng-template>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
class AssortmentGroupDialogComponent extends DialogTemplateComponent<AssortmentGroup> {
  assortmentService = inject(AssortmentService);

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(3),
    ]),
    desc: new FormControl('', Validators.required),
  });

  constructor() {
    super();
    this.formGroup.patchValue({
      name: this.inputData?.name,
      desc: this.inputData?.desc,
    });
  }

  public submit = () => {
    if (this.inputData) {
      this.assortmentService
        .updateGroup(this.inputData?.id ?? '', {
          name: this.formGroup.value.name ?? '',
          desc: this.formGroup.value.desc ?? '',
        })
        .subscribe(this.closeObserver);
    } else {
      this.assortmentService
        .createGroup({
          name: this.formGroup.value.name ?? '',
          desc: this.formGroup.value.desc ?? '',
        })
        .subscribe(this.closeObserver);
    }
  };
}
