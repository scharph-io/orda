import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { Observer } from 'rxjs';

export const FORM = new InjectionToken<FormGroup>('form');

@Component({
  selector: 'orda-dialog-template',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    CommonModule,
    MatButton,
    MatProgressSpinnerModule,
    MatDialogTitle,
  ],
  template: `
    @if (title()) {
      <h2 mat-dialog-title>{{ title() }}</h2>
    } @else {
      <h2 mat-dialog-title>{{ inputData ? 'Bearbeiten' : 'Neu' }}</h2>
    }
    <mat-dialog-content>
      <ng-container *ngTemplateOutlet="customTemplate()" />
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false" cdkFocusInitial>Abbrechen</button>
      <button matButton="tonal" [disabled]="!canSubmit()" (click)="submitClick.emit()">
        {{ inputData ? 'Speichern' : 'Erzeugen' }}
      </button>
    </mat-dialog-actions>
  `,
  styleUrl: './dialog-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTemplateComponent<D, R = D> {
  logger = inject(OrdaLogger);
  customTemplate = input.required<TemplateRef<ElementRef>>();
  form = input.required<FormGroup>();
  submitClick = output();
  canSubmit = input<boolean>(true);
  title = input<string | undefined>(undefined);

  protected readonly inputData = inject<D>(MAT_DIALOG_DATA);
  protected readonly dialogRef: MatDialogRef<DialogTemplateComponent<D, R>, R> =
    inject(MatDialogRef);

  protected closeObserver: Partial<Observer<R>> = {
    next: (value) => {
      this.dialogRef.close(value);
    },
    error: (error) => {
      this.logger.error('Error:', error, this.constructor.name);
    },
  };

  protected trim = (value: string): string => value.trim();
}
