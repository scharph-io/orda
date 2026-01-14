import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '@orda.core/models/role';
import { RoleService } from '@orda.features/data-access/services/role.service';
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
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, switchMap } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'orda-roles',
  imports: [MatButtonModule, MatIconModule, TitleCasePipe],
  template: `
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

    @let roles = roleService.entityResource.value() ?? [];

    @if (roles.length === 0) {
      <div class="text-center py-10 text-gray-500">Noch keine Rollen vorhanden.</div>
    } @else {
      <div class="overflow-hidden rounded-lg border border-gray-100">
        <table class="min-w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-900">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Name</th>
              <th scope="col" class="px-4 py-3 font-semibold text-right w-24"></th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white">
            @for (role of roles; track role.id) {
              <tr class="hover:bg-gray-50 transition-colors group">
                <td class="px-4 py-3 font-medium text-gray-900">
                  {{ role.name | titlecase }}
                </td>

                <td class="px-4 py-3 text-right">
                  <div
                    class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      mat-icon-button
                      (click)="edit(role)"
                      class="!text-gray-600 hover:bg-gray-100 !w-8 !h-8 leading-none"
                      title="Bearbeiten"
                    >
                      <mat-icon class="!text-[1.25rem]">edit</mat-icon>
                    </button>

                    <button
                      mat-icon-button
                      (click)="delete(role)"
                      class="!text-red-600 hover:bg-red-50 !w-8 !h-8 leading-none"
                      title="Löschen"
                    >
                      <mat-icon class="!text-[1.25rem]">delete</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class RolesComponent extends EntityManager<Role> {
  roleService = inject(RoleService);
  logger = inject(OrdaLogger);

  constructor() {
    super();
    this.roleService.entityResource.reload();
  }

  create() {
    this.dialogClosed<RoleDialogComponent, undefined, Role>(
      RoleDialogComponent,
      undefined,
    ).subscribe(() => this.roleService.entityResource.reload());
  }

  edit(r: Role) {
    this.dialogClosed<RoleDialogComponent, Role, Role>(RoleDialogComponent, r).subscribe(() =>
      this.roleService.entityResource.reload(),
    );
  }

  delete(r: Role) {
    this.roleService
      .readById(r.id ?? '')
      .pipe(
        switchMap((role) =>
          this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
            ConfirmDialogComponent,
            {
              message:
                (role.users ?? []).length === 0
                  ? `Soll die Rolle "${role.name}" gelöscht werden?`
                  : `Rolle '${role.name}' wird noch von ${(role.users ?? []).length} Benutzern verwendet.`,
              disableSubmit: (role.users ?? []).length !== 0,
            },
          ),
        ),
      )
      .pipe(
        filter((res) => res),
        switchMap(() => this.roleService.delete(r.id)),
      )
      .subscribe({
        next: () => {
          this.roleService.entityResource.reload();
        },
        error: (err) => this.logger.error(err),
      });
  }
}

@Component({
  selector: 'orda-role-dialog',
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
          <input matInput formControlName="name" placeholder="z.B. Kellner" />
          @if (formGroup.get('name')?.hasError('required')) {
            <mat-error>Name ist erforderlich</mat-error>
          } @else if (formGroup.get('name')?.hasError('minlength')) {
            <mat-error>Mindestens 3 Zeichen</mat-error>
          } @else if (formGroup.get('name')?.hasError('maxlength')) {
            <mat-error>Maximal 10 Zeichen</mat-error>
          }
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
class RoleDialogComponent extends DialogTemplateComponent<Role> {
  roleService = inject(RoleService);

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(3),
    ]),
  });

  constructor() {
    super();
    this.formGroup.patchValue({
      name: this.inputData?.name,
    });
  }

  public submit = () => {
    if (this.inputData) {
      this.roleService
        .update(this.inputData?.id ?? '', {
          name: this.formGroup.value.name ?? '',
        })
        .subscribe(this.closeObserver);
    } else {
      this.roleService
        .create({
          name: this.formGroup.value.name ?? '',
        })
        .subscribe(this.closeObserver);
    }
  };
}
