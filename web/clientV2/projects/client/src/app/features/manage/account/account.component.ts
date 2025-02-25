import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Account } from '@orda.core/models/account';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs';
import { AccountService } from '@orda.features/data-access/services/account/account.service';

@Component({
	selector: 'orda-account',
	imports: [MatButtonModule],
	template: `
		<div class="title-toolbar">
			<h2>Accounts</h2>
			<button mat-button (click)="create()">New</button>
			<br />
			@for (account of accountService.entityResource.value(); track account.id) {
				{{ account.firstname }} ({{ account.lastname }}) - {{ account.main_balance }}
				<button mat-button (click)="edit(account)">Edit</button>
				<button mat-button (click)="delete(account)">Delete</button>
				<br />
			}
		</div>
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends EntityManager<Account> {
	accountService = inject(AccountService);

	constructor() {
		super();
		this.accountService.entityResource.reload();
	}

	create(): void {
		this.dialogClosed<AccountDialogComponent, undefined, Account>(
			AccountDialogComponent,
			undefined,
		).subscribe(() => this.accountService.entityResource.reload());
	}

	edit(a: Account): void {
		this.dialogClosed<AccountDialogComponent, Account, Account>(
			AccountDialogComponent,
			a,
		).subscribe(() => this.accountService.entityResource.reload());
	}

	delete(a: Account): void {
		this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
			message: `${a.firstname} ${a.lastname}`,
		})
			.pipe(switchMap(() => this.accountService.delete(a.id ?? '')))
			.subscribe(() => this.accountService.entityResource.reload());
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
			<form [formGroup]="formGroup">
				<mat-form-field>
					<mat-label>Firstname</mat-label>
					<input matInput formControlName="fistname" />
				</mat-form-field>
				<mat-form-field>
					<mat-label>Lastname</mat-label>
					<input matInput formControlName="lastname" />
				</mat-form-field>
				<!-- <mat-form-field>
					<mat-label>Type</mat-label>
					<mat-select formControlName="type">
						<mat-option value="admin">Admin</mat-option>
						<mat-option value="user">User</mat-option>
					</mat-select>
				</mat-form-field> -->
			</form>
		</ng-template>
	`,
	imports: [
		DialogTemplateComponent,
		MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
		MatLabel,
		MatFormField,
		MatInput,
		MatSelectModule,
		TitleCasePipe,
	],
	providers: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class AccountDialogComponent extends DialogTemplateComponent<Account> {
	accountService = inject(AccountService);

	formGroup = new FormGroup({
		firstname: new FormControl<string>('', [
			Validators.required,
			Validators.minLength(3),
			Validators.maxLength(15),
		]),
		lastname: new FormControl<string>('', [Validators.required, Validators.maxLength(20)]),
	});

	constructor() {
		super();
		this.formGroup.patchValue({
			firstname: this.inputData?.firstname,
			lastname: this.inputData?.lastname,
		});
	}

	public submit = () => {
		if (this.inputData) {
			this.accountService
				.update(this.inputData.id ?? '', {
					firstname: this.formGroup.value.firstname ?? '',
					lastname: this.formGroup.value.lastname ?? '',
				})
				.subscribe(this.closeObserver);
		} else {
			this.accountService
				.create({
					firstname: this.formGroup.value.firstname ?? '',
					lastname: this.formGroup.value.lastname ?? '',
				})
				.subscribe(this.closeObserver);
		}
	};
}
