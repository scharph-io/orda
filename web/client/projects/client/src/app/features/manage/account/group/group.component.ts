import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AccountGroup } from '@orda.core/models/account';
import { MatListModule } from '@angular/material/list';
import { AccountGroupService } from '@orda.features/data-access/services/account/account-group.service';
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
import { MatInput } from '@angular/material/input';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, switchMap } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { AccountService } from '@orda.features/data-access/services/account/account.service';

@Component({
  selector: 'orda-account-groups',
  imports: [MatButtonModule, MatListModule, MatIcon],
  template: `
    <button mat-flat-button color="primary" class="h-[56px] !rounded-lg" (click)="create()">
      <mat-icon>add</mat-icon> Gruppe
    </button>

    <mat-list group="list">
      @for (ag of accountGroupService.entityResource.value(); track ag.id) {
        <mat-list-item group="listitem">
          <div class="item">
            <p>{{ ag.name }}</p>
            <div>
              <button title="delete group" class="delete-btn" mat-icon-button (click)="delete(ag)">
                <mat-icon>delete</mat-icon>
              </button>
              <button title="edit group" mat-icon-button (click)="edit(ag)">
                <mat-icon>edit</mat-icon>
              </button>
              <!-- <button title="update group policy" mat-icon-button (click)="updatePolicy(group)">
                <mat-icon>policy</mat-icon>
              </button> -->
            </div>
          </div>
        </mat-list-item>
      }
    </mat-list>
  `,
  styles: `
    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .title-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `,
})
export class AccountGroupComponent extends EntityManager<AccountGroup> {
  accountGroupService = inject(AccountGroupService);
  accountService = inject(AccountService);
  logger = inject(OrdaLogger);

  constructor() {
    super();
    this.accountGroupService.entityResource.reload();
  }

  create() {
    this.dialogClosed<AccountGroupDialogComponent, undefined, AccountGroup>(
      AccountGroupDialogComponent,
      undefined,
    ).subscribe(() => this.accountGroupService.entityResource.reload());
  }

  edit(ag: AccountGroup) {
    this.dialogClosed<AccountGroupDialogComponent, AccountGroup, AccountGroup>(
      AccountGroupDialogComponent,
      ag,
    ).subscribe(() => this.accountGroupService.entityResource.reload());
  }

  delete(ag: AccountGroup) {
    this.accountService
      .readByGroupId(ag.id ?? '')
      .pipe(
        switchMap((res) =>
          this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
            ConfirmDialogComponent,
            {
              message:
                res.length === 0 ? ag.name : `Group '${ag.name}' is in use by ${res.length} users`,
              disableSubmit: res.length !== 0,
            },
          ),
        ),
      )
      .pipe(
        filter((res) => res),
        switchMap(() => this.accountGroupService.delete(ag.id)),
      )
      .subscribe({
        next: () => {
          this.accountGroupService.entityResource.reload();
        },
        error: (err) => this.logger.error(err),
      });
  }
}

@Component({
  selector: 'orda-group-dialog',
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
      <form [formGroup]="formGroup">
        <div class="dialog-flex">
          <mat-form-field>
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>
        </div>
      </form>
    </ng-template>
  `,
  styles: ``,
})
class AccountGroupDialogComponent extends DialogTemplateComponent<AccountGroup> {
  roleService = inject(AccountGroupService);

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
