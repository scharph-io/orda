import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Account } from '@orda.core/models/account';
import { EntityManager } from '@orda.shared/utils/entity-manager';

import { AccountService } from '@orda.features/data-access/services/account/account.service';

import { MatExpansionModule } from '@angular/material/expansion';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { rxResource } from '@angular/core/rxjs-interop';
import {
	FormsModule,
	ReactiveFormsModule,
	FormGroup,
	FormControl,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap, filter, tap } from 'rxjs';

@Component({
	selector: 'orda-account',
	imports: [
		MatButtonModule,
		MatExpansionModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatFormFieldModule,
		MatInputModule,
		OrdaCurrencyPipe,
	],
	template: `
		<button mat-button (click)="create()">New</button>
		<mat-form-field>
			<mat-label>Filter</mat-label>
			<input matInput (keyup)="applyFilter($event)" placeholder="Ex. Mia" #input />
		</mat-form-field>

		<div class="mat-elevation-z8">
			<table mat-table [dataSource]="dataSource()" matSort>
				<ng-container matColumnDef="name">
					<th mat-header-cell *matHeaderCellDef mat-sort-header>Firstname</th>
					<td mat-cell *matCellDef="let row">{{ row.lastname }} {{ row.firstname }}</td>
				</ng-container>

				<ng-container matColumnDef="group">
					<th mat-header-cell *matHeaderCellDef mat-sort-header>Group</th>
					<td mat-cell *matCellDef="let row">{{ row.group }}</td>
				</ng-container>

				<ng-container matColumnDef="main-balance">
					<th mat-header-cell *matHeaderCellDef mat-sort-header>Balance</th>
					<td mat-cell *matCellDef="let row">{{ row.main_balance | currency }}</td>
				</ng-container>

				<ng-container matColumnDef="credit-balance">
					<th mat-header-cell *matHeaderCellDef mat-sort-header>Credit</th>
					<td mat-cell *matCellDef="let row">{{ row.credit_balance | currency }}</td>
				</ng-container>

				<ng-container matColumnDef="actions">
					<th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
					<td mat-cell *matCellDef="let row">
						<button mat-button (click)="delete(row)" [disabled]="hasMainBalance(row)">
							Delete
						</button>
						<button mat-button (click)="edit(row)">Edit</button>
						<button mat-button (click)="deposit(row)">Deposit</button>
					</td>
				</ng-container>

				<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
				<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

				<!-- Row shown when there is no matching data. -->
				<tr class="mat-row" *matNoDataRow>
					<td class="mat-cell" colspan="4">No data matching the filter "{{ input.value }}"</td>
				</tr>
			</table>
		</div>
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends EntityManager<Account> {
	logger = inject(OrdaLogger);
	accountService = inject(AccountService);

	data = rxResource<Account[], undefined>({
		loader: () => this.accountService.read(),
	});

	dataSource = computed(() => new MatTableDataSource(this.data.value() ?? []));

	constructor() {
		super();
	}

	displayedColumns: string[] = ['name', 'group', 'main-balance', 'credit-balance', 'actions'];

	sort = viewChild(MatSort);
	paginator = viewChild(MatPaginator);

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource().filter = filterValue.trim().toLowerCase();
		if (this.dataSource().paginator) {
			this.dataSource().paginator?.firstPage();
		}
	}

	create() {
		this.dialogClosed<AccountDialogComponent, undefined, Account>(
			AccountDialogComponent,
			undefined,
		).subscribe(() => this.data.reload());
	}

	edit(acc: Account) {
		this.dialogClosed<AccountDialogComponent, Account, Account>(
			AccountDialogComponent,
			acc,
		).subscribe(() => this.data.reload());
	}

	delete(acc: Account) {
		this.accountService
			.readById(acc.id ?? '')
			.pipe(
				switchMap((acc) =>
					this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
						ConfirmDialogComponent,
						{
							message: `Are you sure you want to delete the group '${acc.firstname}'?`,
						},
					),
				),
			)
			.pipe(
				filter((res) => res),
				switchMap(() => this.accountService.delete(acc.id)),
			)
			.subscribe({
				next: () => {
					this.data.reload();
				},
				error: (err) => this.logger.error(err),
			});
	}

	hasMainBalance(acc: Account): boolean {
		return acc.main_balance !== 0;
	}

	deposit(acc: Account) {
		this.dialogClosed<AccountDepositDialogComponent, Account, Account>(
			AccountDepositDialogComponent,
			acc,
		).subscribe(() => this.data.reload());
	}
}

@Component({
	selector: 'orda-account-group-dialog',
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
				<mat-form-field>
					<mat-label>Firstname</mat-label>
					<input matInput formControlName="firstname" />
				</mat-form-field>
				<mat-form-field>
					<mat-label>Lastname</mat-label>
					<input matInput formControlName="lastname" />
				</mat-form-field>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AccountDialogComponent extends DialogTemplateComponent<Account> {
	accountGroupService = inject(AccountService);

	formGroup = new FormGroup({
		firstname: new FormControl('', [
			Validators.required,
			Validators.maxLength(10),
			Validators.minLength(3),
		]),
		lastname: new FormControl('', [
			Validators.required,
			Validators.maxLength(10),
			Validators.minLength(3),
		]),
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
			this.accountGroupService
				.update(this.inputData?.id ?? '', {
					firstname: this.formGroup.value.firstname ?? '',
					lastname: this.formGroup.value.lastname ?? '',
				})
				.subscribe(this.closeObserver);
		} else {
			this.accountGroupService
				.create({
					firstname: this.formGroup.value.firstname ?? '',
					lastname: this.formGroup.value.lastname ?? '',
				})
				.subscribe(this.closeObserver);
		}
	};
}

@Component({
	selector: 'orda-account-deposit-dialog',
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
				<mat-form-field>
					<mat-label>Amount</mat-label>
					<input matInput formControlName="amount" />
				</mat-form-field>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AccountDepositDialogComponent extends DialogTemplateComponent<Account> {
	accountGroupService = inject(AccountService);

	formGroup = new FormGroup({
		amount: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
	});

	constructor() {
		super();
	}

	public submit = () => {
		this.accountGroupService
			.deposit(this.inputData?.id ?? '', {
				amount: this.formGroup.value.amount ?? 0,
				userid: 'anon',
				history_type: 0,
				deposit_type: 0,
			})
			.pipe(tap((acc) => console.log(acc)))
			.subscribe(this.closeObserver);
	};
}
