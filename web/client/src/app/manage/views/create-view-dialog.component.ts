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
import { MessageService } from '../../shared/services/message.service';
import { ViewService } from '../../shared/services/view.service';
import { View } from '../../shared/model/view';

export enum ActionType {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
}

@Component({
  selector: 'orda-create-view-dialog',
  template: `<form [formGroup]="viewForm">
    <h2 mat-dialog-title>
      @if (isUpdate) {
        {{ 'view.edit' | transloco }}
      } @else {
        {{ 'view.add' | transloco }}
      }
    </h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>{{ 'table.name' | transloco }}</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close type="reset">
        {{ 'dialog.cancel' | transloco }}
      </button>
      @if (isUpdate) {
        <!-- <button
          disabled
          mat-button
          style="background-color: red; color:white"
          (click)="submit(ActionType.DELETE)"
          type="submit"
        >
          {{ 'dialog.delete' | transloco }}
        </button> -->
        <button
          mat-button
          color="primary"
          type="submit"
          (click)="submit(ActionType.EDIT)"
          style="background-color: green; color:white"
          [disabled]="!viewForm.valid"
        >
          {{ 'dialog.edit' | transloco }}
        </button>
      } @else {
        <button
          mat-button
          type="submit"
          (click)="submit(ActionType.ADD)"
          type="submit"
          [disabled]="!viewForm.valid"
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
export class CreateViewDialogComponent {
  viewForm = new FormGroup({
    name: new FormControl('', Validators.required),
    desc: new FormControl(''),
    deposit: new FormControl(0),
  });

  isUpdate = false;

  dialogRef = inject(MatDialogRef<CreateViewDialogComponent>);
  messageService = inject(MessageService);
  viewService = inject(ViewService);

  view = inject<View>(MAT_DIALOG_DATA);

  ActionType = ActionType;

  constructor() {
    console.log('CreateViewDialogComponent', this.view.name);
    if (this.view) {
      this.viewForm.patchValue(this.view);
      this.isUpdate = true;
    }
  }

  submit(action: ActionType) {
    const data = this.viewForm.value;
    this.dialogRef.close({
      action,
      data: {
        name: data.name,
      } as View,
    });
  }
}
