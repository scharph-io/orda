import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { User } from '@orda.core/models/user';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { UserService } from '@orda.features/data-access/services/user.service';
import { RoleService } from '@orda.features/data-access/services/role.service';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { RolesComponent } from '../roles/roles.component';
import { StrongPasswordRegx } from '@orda.core/constants';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'orda-users',
  imports: [
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    RolesComponent,
    NavSubHeaderComponent,
    TitleCasePipe,
  ],
  template: `
    <orda-nav-sub-header title="Benutzerverwaltung" [showBackButton]="true" />

    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <mat-tab-group
        mat-stretch-tabs="false"
        mat-align-tabs="start"
        animationDuration="0ms"
        class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[600px]"
      >
        <mat-tab label="Benutzer">
          <ng-template matTabContent>
            <div class="p-6">
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

              @let users = userService.entityResource.value() ?? [];

              <div class="overflow-hidden rounded-lg border border-gray-100">
                <table class="min-w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-gray-50 border-b border-gray-200 text-gray-900">
                    <tr>
                      <th scope="col" class="px-4 py-3 font-semibold">Benutzername</th>
                      <th scope="col" class="px-4 py-3 font-semibold">Rolle</th>
                      <th scope="col" class="px-4 py-3 font-semibold text-right w-24"></th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-gray-100 bg-white">
                    @for (user of users; track user.id) {
                      <tr class="hover:bg-gray-50 transition-colors group">
                        <td class="px-4 py-3 font-medium text-gray-900">
                          {{ user.username }}
                        </td>

                        <td class="px-4 py-3 text-gray-500">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                          >
                            {{ user.role | titlecase }}
                          </span>
                        </td>

                        <td class="px-4 py-3 text-right">
                          <div
                            class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <button
                              mat-icon-button
                              (click)="edit(user)"
                              class="!text-gray-600 hover:bg-gray-100 !w-8 !h-8 leading-none"
                              title="Bearbeiten"
                            >
                              <mat-icon class="!text-[1.25rem]">edit</mat-icon>
                            </button>

                            <button
                              mat-icon-button
                              (click)="delete(user)"
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
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="Rollen">
          <ng-template matTabContent>
            <div class="p-6">
              <orda-roles />
            </div>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </main>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends EntityManager<User> {
  userService = inject(UserService);

  constructor() {
    super();
    this.userService.entityResource.reload();
  }

  create(): void {
    this.dialogClosed<UserDialogComponent, undefined, User>(
      UserDialogComponent,
      undefined,
    ).subscribe(() => this.userService.entityResource.reload());
  }

  edit(u: User): void {
    this.dialogClosed<UserDialogComponent, User, User>(UserDialogComponent, u).subscribe(() =>
      this.userService.entityResource.reload(),
    );
  }

  delete(u: User): void {
    this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
      message: `Soll der Benutzer "${u.username}" wirklich gelöscht werden?`,
    })
      .pipe(switchMap(() => this.userService.delete(u.id ?? '')))
      .subscribe(() => this.userService.entityResource.reload());
  }
}

@Component({
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
          <input matInput formControlName="name" placeholder="Benutzername" />
          @if (formGroup.get('name')?.hasError('required')) {
            <mat-error>Name ist erforderlich</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Passwort</mat-label>
          <input type="password" matInput formControlName="password" placeholder="********" />
          @if (formGroup.get('password')?.hasError('required')) {
            <mat-error>Passwort ist erforderlich</mat-error>
          } @else if (formGroup.get('password')?.hasError('pattern')) {
            <mat-error>Passwort ist zu schwach</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rolle</mat-label>
          <mat-select formControlName="role">
            @for (role of roleService.entityResource.value(); track role.id) {
              <mat-option [value]="role.id">{{ role.name | titlecase }}</mat-option>
            }
          </mat-select>
          @if (formGroup.get('role')?.hasError('required')) {
            <mat-error>Rolle ist erforderlich</mat-error>
          }
        </mat-form-field>
      </form>
    </ng-template>
  `,
  imports: [
    DialogTemplateComponent,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInput,
    MatSelectModule,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class UserDialogComponent extends DialogTemplateComponent<User> {
  roleService = inject(RoleService);
  userService = inject(UserService);

  formGroup = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
    password: new FormControl<string>('', [
      Validators.minLength(3),
      Validators.maxLength(25),
      Validators.pattern(StrongPasswordRegx),
    ]),
    role: new FormControl<string>('', Validators.required),
  });

  constructor() {
    super();
    this.formGroup.patchValue({
      name: this.inputData?.username,
      role: this.inputData?.roleid,
    });

    // If creating a NEW user, password is required
    if (!this.inputData) {
      this.formGroup.controls.password.addValidators(Validators.required);
    }
  }

  public submit = () => {
    if (this.inputData) {
      this.userService
        .update(this.inputData.id ?? '', {
          username: this.formGroup.value.name ?? '',
          roleid: this.formGroup.value.role ?? '',
          // Only send password if it was changed/entered
          ...(this.formGroup.value.password ? { password: this.formGroup.value.password } : {}),
        })
        .subscribe(this.closeObserver);
    } else {
      this.userService
        .create({
          username: this.formGroup.value.name ?? '',
          roleid: this.formGroup.value.role ?? '',
          password: this.formGroup.value.password ?? '',
        })
        .subscribe(this.closeObserver);
    }
  };
}
