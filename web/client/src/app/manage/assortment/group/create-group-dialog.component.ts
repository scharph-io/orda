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
import { Group, Product } from '../../../shared/model/product';
import {
  MessageService,
  Severity,
} from '../../../shared/services/message.service';
import { AssortmentService } from '../../../shared/services/assortment.service';
import { catchError, EMPTY } from 'rxjs';

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
      <button mat-button mat-dialog-close>
        {{ 'dialog.cancel' | transloco }}
      </button>
      @if (isUpdate) {
        <button
          mat-button
          color="primary"
          (click)="update()"
          [disabled]="!groupForm.valid"
        >
          {{ 'dialog.update' | transloco }}
        </button>
      } @else {
        <button
          mat-button
          type="submit"
          (click)="create()"
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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { group?: Group; groupId: string },
  ) {
    if (this.data.group !== undefined) {
      this.isUpdate = true;
      this.groupForm.patchValue({
        name: this.data.group.name,
        desc: this.data.group.desc,
        deposit: this.data.group.deposit / 100,
      });
    }
  }

  create() {
    if (this.groupForm.valid) {
      const value = this.groupForm.value;
      this.assortmentService
        .addGroup$({
          name: value.name ?? '',
          desc: value.desc ?? '',
          deposit: Math.round((value.deposit ?? 0) * 100),
        })
        .pipe(
          catchError((err) => {
            this.messageService.send({
              title: err.statusText,
              severity: Severity.ERROR,
            });
            return EMPTY;
          }),
        )
        .subscribe((res) => {
          this.dialogRef.close(res);
        });
    }
  }

  update() {
    console.log(this.groupForm.value);
    if (this.groupForm.valid) {
      const value = this.groupForm.value;
      this.assortmentService
        .updateGroup$(this.data.group?.id ?? '', {
          name: value.name ?? '',
          desc: value.desc ?? '',
          deposit: Math.round((value.deposit ?? 0) * 100),
        })
        .subscribe((res) => {
          this.dialogRef.close(res);
        });
    }
  }
}
