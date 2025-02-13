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
import { OrdaLogger } from '@shared/services/logger.service';
import { Observer } from 'rxjs';

export const FORM = new InjectionToken<FormGroup>('form');

@Component({
	selector: 'orda-dialog-template',
	imports: [
		MatDialogActions,
		MatDialogClose,
		MatDialogTitle,
		MatDialogContent,
		CommonModule,
		MatButton,
		MatProgressSpinnerModule,
	],
	template: `
		<h2 mat-dialog-title>{{ inputData ? 'Update' : 'Create' }}</h2>
		<mat-dialog-content>
			<ng-container *ngTemplateOutlet="customTemplate()"></ng-container>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Cancel</button>
			<button
				mat-button
				[disabled]="this.form().invalid || !this.form().dirty"
				(click)="submitClick.emit()"
			>
				{{ inputData ? 'Update' : 'Save' }}
			</button>
		</mat-dialog-actions>
	`,
	styleUrl: './dialog-template.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTemplateComponent<T> {
	logger = inject(OrdaLogger);
	customTemplate = input.required<TemplateRef<ElementRef>>();
	form = input.required<FormGroup>();
	submitClick = output();

	protected readonly inputData = inject<T>(MAT_DIALOG_DATA);
	protected readonly dialogRef: MatDialogRef<DialogTemplateComponent<T>, T> = inject(MatDialogRef);

	protected closeObserver: Partial<Observer<T>> = {
		next: (value) => {
			this.dialogRef.close(value);
		},
		error: (error) => {
			this.logger.error('Error:', error, this.constructor.name);
		},
	};
}
