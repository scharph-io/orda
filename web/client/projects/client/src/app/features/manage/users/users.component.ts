import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '@orda.core/models/user';
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
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

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
                  mat-flat-button
                  color="primary"
                  class="h-[56px] !rounded-lg"
                  (click)="create()"
                >
                  <mat-icon>add</mat-icon> Benutzer
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
                          <div class="flex items-center justify-end gap-1  transition-opacity">
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
interface UserForm {
  name: FormControl<string>;
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>; // 1. Added field
  role: FormControl<string>;
}

@Component({
  selector: 'orda-user-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TitleCasePipe,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ isEditMode ? 'Benutzer bearbeiten' : 'Neuer Benutzer' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="user-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Benutzername" />
          @if (form.controls.name.hasError('required')) {
            <mat-error>Name ist erforderlich</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rolle</mat-label>
          <mat-select formControlName="role">
            @for (role of roleService.entityResource.value(); track role.id) {
              <mat-option [value]="role.id">{{ role.name | titlecase }}</mat-option>
            }
          </mat-select>
          @if (form.controls.role.hasError('required')) {
            <mat-error>Rolle ist erforderlich</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Passwort</mat-label>
          <input
            type="password"
            matInput
            formControlName="password"
            [placeholder]="isEditMode ? 'Leer lassen um beizubehalten' : '********'"
            autocomplete="new-password"
          />
          @if (form.controls.password.hasError('required')) {
            <mat-error>Passwort ist erforderlich</mat-error>
          }
          @if (form.controls.password.hasError('pattern')) {
            <mat-error>Passwort ist zu schwach</mat-error>
          }
        </mat-form-field>

        @if (!isEditMode || form.controls.password.value) {
          <mat-form-field appearance="outline">
            <mat-label>Passwort bestätigen</mat-label>
            <input
              type="password"
              matInput
              formControlName="passwordConfirm"
              placeholder="********"
              autocomplete="new-password"
            />

            @if (form.controls.passwordConfirm.hasError('required')) {
              <mat-error>Bestätigung ist erforderlich</mat-error>
            }
            @if (form.hasError('mismatch') && !form.controls.passwordConfirm.hasError('required')) {
              <mat-error>Passwörter stimmen nicht überein</mat-error>
            }
          </mat-form-field>
        }
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
      .user-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-top: 0.5rem;
        min-width: 300px;
      }
    `,
  ],
})
export class UserDialogComponent {
  public roleService = inject(RoleService);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<UserDialogComponent>);

  data = inject<User | undefined>(MAT_DIALOG_DATA);

  // 2. Define Validator for the Group
  private passwordMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirm = control.get('passwordConfirm')?.value;

    // If both are empty (edit mode default), it's valid
    if (!password && !confirm) return null;

    return password === confirm ? null : { mismatch: true };
  };

  protected form = new FormGroup<UserForm>(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)],
      }),
      password: new FormControl(null, [
        Validators.minLength(3),
        Validators.maxLength(25),
        Validators.pattern(StrongPasswordRegx),
      ]),
      passwordConfirm: new FormControl(null),
      role: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: this.passwordMatchValidator },
  ); // Apply group validator

  constructor() {
    if (this.isEditMode) {
      this.form.patchValue({
        name: this.data!.username,
        role: this.data!.roleid,
      });
    } else {
      // Create Mode: Both fields are mandatory
      this.form.controls.password.addValidators(Validators.required);
      this.form.controls.passwordConfirm.addValidators(Validators.required);
    }
  }

  get isEditMode(): boolean {
    return !!this.data?.id;
  }

  submit() {
    if (this.form.invalid) return;

    // Destructure to separate passwordConfirm (which we don't send to backend)
    const { name, role, password } = this.form.getRawValue();

    const payload: Partial<User> = {
      username: name,
      roleid: role,
    };

    if (this.isEditMode) {
      if (password) {
        payload.password = password;
      }
      this.userService.update(this.data!.id!, payload).subscribe(this.handleResponse);
    } else {
      // CREATE
      this.userService
        .create({
          username: name,
          roleid: role,
          password: password ?? '',
        })
        .subscribe(this.handleResponse);
    }
  }

  private handleResponse = {
    next: (res: unknown) => this.dialogRef.close(res),
    error: (err: unknown) => console.error('Error saving user', err),
  };
}
