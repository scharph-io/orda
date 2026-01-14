import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, map, switchMap } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { View } from '@orda.core/models/view';
import { MatSelect } from '@angular/material/select';
import { RoleService } from '@orda.features/data-access/services/role.service';
import { MatOption } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';

@Component({
  selector: 'orda-view-list',
  imports: [MatButtonModule, MatListModule, MatIcon, RouterModule, NavSubHeaderComponent],
  template: `
    <orda-nav-sub-header title="Bestellseiten" [showBackButton]="true" />

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

      @let views = viewService.entityResource.value() ?? [];

      @if (views.length === 0) {
        <div class="text-center py-10 text-gray-500">
          Noch keine Bestellseiten vorhanden.
          <button mat-button color="primary" (click)="create()">Jetzt anlegen</button>
        </div>
      } @else {
        <div class="overflow-hidden bg-white">
          <table class="min-w-full text-left text-sm whitespace-nowrap">
            <thead class="border-b border-gray-900 text-gray-900">
              <tr>
                <th scope="col" class="px-3 py-3 font-semibold">Name</th>
                <th scope="col" class="px-3 py-3 font-semibold">Beschreibung</th>
                <th scope="col" class="px-3 py-3 font-semibold text-right w-32"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              @for (view of views; track view.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-3 py-4 font-medium text-gray-900">
                    {{ view.name }}
                  </td>

                  <td class="px-3 py-4 text-gray-500">
                    {{ view.desc }}
                  </td>

                  <td class="px-3 py-4 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        mat-icon-button
                        (click)="delete(view)"
                        class="!text-red-600 hover:bg-red-50"
                        title="Löschen"
                      >
                        <mat-icon>delete</mat-icon>
                      </button>

                      <button
                        mat-icon-button
                        (click)="edit(view)"
                        class="!text-gray-600 hover:bg-gray-100"
                        title="Bearbeiten"
                      >
                        <mat-icon>edit</mat-icon>
                      </button>

                      <button
                        mat-icon-button
                        [routerLink]="[view.id]"
                        [state]="{ name: view.name }"
                        class="!text-gray-600 hover:bg-gray-100"
                        title="Einstellungen"
                      >
                        <mat-icon>settings</mat-icon>
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
export class ViewListComponent extends EntityManager<View> {
  viewService = inject(ViewService);
  logger = inject(OrdaLogger);

  constructor() {
    super();
  }

  create() {
    this.dialogClosed<ViewListDialogComponent, undefined, View>(
      ViewListDialogComponent,
      undefined,
    ).subscribe(() => this.viewService.entityResource.reload());
  }

  edit(v: View) {
    this.dialogClosed<ViewListDialogComponent, View, View>(ViewListDialogComponent, v).subscribe(
      () => this.viewService.entityResource.reload(),
    );
  }

  delete(v: View) {
    this.viewService
      .readById(v.id ?? '')
      .pipe(
        switchMap((view) =>
          this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
            ConfirmDialogComponent,
            {
              message: `Soll "${view.name}" wirklich gelöscht werden?`,
            },
          ),
        ),
      )
      .pipe(
        filter((res) => res),
        switchMap(() => this.viewService.delete(v.id)),
      )
      .subscribe({
        next: () => {
          this.viewService.entityResource.reload();
        },
        error: (err) => this.logger.error(err),
      });
  }
}

@Component({
  selector: 'orda-view-list-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DialogTemplateComponent,
    MatLabel,
    MatFormFieldModule,
    MatInput,
    MatSelect,
    MatOption,
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
          <input matInput formControlName="name" placeholder="z.B. Kantine" />
          @if (formGroup.get('name')?.hasError('required')) {
            <mat-error>Name ist erforderlich</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Beschreibung</mat-label>
          <input matInput formControlName="desc" placeholder="z.B. Heimspiel" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rollen</mat-label>
          <mat-select formControlName="roles" multiple [value]="viewDetails.value()">
            @for (role of roleService.entityResource.value(); track role.id) {
              <mat-option [value]="role.id">{{ role.name }}</mat-option>
            }
          </mat-select>
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
class ViewListDialogComponent extends DialogTemplateComponent<View> {
  viewService = inject(ViewService);
  roleService = inject(RoleService);

  viewDetails = rxResource({
    stream: () =>
      this.viewService.readById(this.inputData.id).pipe(map((view) => view.roles.map((r) => r.id))),
  });

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(3),
    ]),
    desc: new FormControl('', [Validators.maxLength(40)]),
    roles: new FormControl([]),
    deposit: new FormControl(0, [Validators.required, Validators.min(0)]),
  });

  constructor() {
    super();

    this.formGroup.patchValue({
      name: this.inputData?.name,
      deposit: this.inputData?.deposit,
      desc: this.inputData?.desc,
    });
  }

  public submit = () => {
    const commonData = {
      name: this.formGroup.value.name ?? '',
      desc: this.formGroup.value.desc ?? '',
    };

    const roles = this.formGroup.value.roles ?? [];

    let obs$;
    if (this.inputData) {
      obs$ = this.viewService.update(this.inputData.id ?? '', commonData);
    } else {
      obs$ = this.viewService.create({ ...commonData, deposit: 100 });
    }

    obs$
      .pipe(
        // SwitchMap passes the View ID (either from input or created view) to setRoles
        switchMap((res) => {
          const id = this.inputData ? this.inputData.id : res.id;
          return this.viewService.setRoles(id, roles);
        }),
      )
      .subscribe(this.closeObserver);
  };
}
