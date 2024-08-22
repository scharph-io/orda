import { Component, Inject, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { TranslocoModule } from '@jsverse/transloco';
import { Group } from '../../../shared/model/product';
import { MessageService } from '../../../shared/services/message.service';
import { AssortmentService } from '../../../shared/services/assortment.service';

export enum ActionType {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
}

@Component({
  selector: 'orda-create-group-dialog',
  template: `<form [formGroup]="groupForm">
    <h2 mat-dialog-title>
      @if (isUpdate) {
        {{ 'group.edit' | transloco }}
      } @else {
        {{ 'group.add' | transloco }}
      }
    </h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>{{ 'table.name' | transloco }}</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>{{ 'table.desc' | transloco }}</mat-label>
        <input matInput formControlName="desc" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>{{ 'table.deposit' | transloco }}</mat-label>
        <input matInput formControlName="deposit" type="number" />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close type="reset">
        {{ 'dialog.cancel' | transloco }}
      </button>
      @if (isUpdate) {
        <button
          disabled
          mat-button
          style="background-color: red; color:white"
          (click)="submit(ActionType.DELETE)"
          type="submit"
        >
          {{ 'dialog.delete' | transloco }}
        </button>
        <button
          mat-button
          color="primary"
          type="submit"
          (click)="submit(ActionType.EDIT)"
          style="background-color: green; color:white"
          [disabled]="!groupForm.valid"
        >
          {{ 'dialog.edit' | transloco }}
        </button>
      } @else {
        <button
          mat-button
          type="submit"
          (click)="submit(ActionType.ADD)"
          type="submit"
          [disabled]="!groupForm.valid"
        >
          {{ 'dialog.create' | transloco }}
        </button>
      }
    </mat-dialog-actions>
  </form>`,
  styles: [
    `
      mat-dialog-content {
        display: flex;
        flex-direction: column;
      }

      .mat-error {
        color: red;
      }
    `,
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    TranslocoModule,
  ],
})
export class CreateGroupDialogComponent {
  groupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    desc: new FormControl(''),
    deposit: new FormControl(0),
  });

  isUpdate = false;

  dialogRef = inject(MatDialogRef<CreateGroupDialogComponent>);
  messageService = inject(MessageService);
  assortmentService = inject(AssortmentService);

  group = inject<Group>(MAT_DIALOG_DATA);

  ActionType = ActionType;

  constructor() {
    if (this.group) {
      this.groupForm.patchValue({
        name: this.group.name,
        desc: this.group.desc ?? '',
        deposit: this.group.deposit / 100,
      });
      this.isUpdate = true;
    }
  }

  submit(action: ActionType) {
    const data = this.groupForm.value;
    this.dialogRef.close({
      action,
      data: {
        name: data.name,
        desc: data.desc,
        deposit: Math.round((data.deposit ?? 0) * 100),
      } as Group,
    });
  }
}
