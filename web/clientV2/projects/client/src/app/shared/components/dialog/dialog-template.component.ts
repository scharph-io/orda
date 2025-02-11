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
	],
	template: `
		<h2 mat-dialog-title>{{ data ? 'Update' : 'Create' }}</h2>
		<mat-dialog-content>
			<ng-container *ngTemplateOutlet="customTemplate()"></ng-container>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close (click)="cancelClick()">Cancel</button>
			<button
				mat-button
				mat-dialog-close
				[disabled]="this.form().invalid || !this.form().dirty"
				(click)="onSubmit()"
			>
				{{ data ? 'Update' : 'Save' }}
			</button>
		</mat-dialog-actions>
	`,
	styleUrl: './dialog-template.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTemplateComponent<T> {
	customTemplate = input.required<TemplateRef<ElementRef>>();
	form = input.required<FormGroup>();
	submitClick = output();

	protected readonly data = inject<T>(MAT_DIALOG_DATA);
	protected readonly dialogRef: MatDialogRef<DialogTemplateComponent<T>, T> = inject(MatDialogRef);

	protected cancelClick = () => this.dialogRef.close();

	onSubmit() {
		this.submitClick.emit();
	}
}
