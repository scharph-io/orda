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
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { EMPTY, filter, map, switchMap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DEPOSIT_VALUES } from '@orda.core/constants';
import { GroupDepositDialogComponent } from '@orda.features/manage/account/dialogs/group-deposit-dialog/group-deposit.component';
import { AccountDetailDialogComponent } from '@orda.features/manage/account/dialogs/accout-detail-dialog/account-detail-dialog.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountGroupComponent } from './group/group.component';
import { AccountGroupService } from '@orda.features/data-access/services/account/account-group.service';
import { TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

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
		MatIcon,
		RouterModule,
		MatTabsModule,
		AccountGroupComponent,
	],
	template: `
		<mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms">
			<mat-tab label="Accounts">
				<button mat-button (click)="create()">New</button>
				<button mat-button (click)="groupDeposit()">Group Deposit</button>
				<br />
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
								<button mat-icon-button (click)="delete(row)" [disabled]="hasMainBalance(row)">
									<mat-icon>delete</mat-icon>
								</button>
								<button mat-icon-button (click)="edit(row)">
									<mat-icon>edit</mat-icon>
								</button>
								<button mat-icon-button (click)="deposit(row)">
									<mat-icon>add_business</mat-icon>
								</button>
								<button mat-icon-button (click)="info(row)">
									<mat-icon>info</mat-icon>
								</button>
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
			</mat-tab>
			<mat-tab label="Groups">
				<ng-template matTabContent><orda-account-groups /></ng-template>
			</mat-tab>
		</mat-tab-group>
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends EntityManager<Account> {
	logger = inject(OrdaLogger);
	accountService = inject(AccountService);

	data = rxResource<Account[], undefined>({
		loader: () =>
			this.accountService
				.read()
				.pipe(map((res) => res.sort((a, b) => a.lastname.localeCompare(b.lastname)))),
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
							message: `Are you sure you want to delete the account '${acc.lastname} ${acc.firstname}'?`,
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

	info(acc: Account) {
		this.dialogClosed<AccountDetailDialogComponent, Account, undefined>(
			AccountDetailDialogComponent,
			acc,
		).subscribe(() => EMPTY);
	}

	groupDeposit() {
		this.dialogClosed<GroupDepositDialogComponent, undefined, undefined>(
			GroupDepositDialogComponent,
			undefined,
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
		MatSelectModule,
		TitleCasePipe,
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
				<mat-form-field>
					<mat-label>Group</mat-label>
					<mat-select formControlName="group">
						@for (ag of accountGroupService.entityResource.value(); track ag.id) {
							<mat-option [value]="ag.id">{{ ag.name | titlecase }}</mat-option>
						}
					</mat-select>
				</mat-form-field>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AccountDialogComponent extends DialogTemplateComponent<Account> {
	accountService = inject(AccountService);
	accountGroupService = inject(AccountGroupService);

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
		group: new FormControl('', [Validators.required]),
	});

	constructor() {
		super();

		this.formGroup.patchValue({
			firstname: this.inputData?.firstname,
			lastname: this.inputData?.lastname,
			group: this.inputData?.groupid,
		});
	}

	public submit = () => {
		if (this.inputData) {
			this.accountService
				.update(this.inputData?.id ?? '', {
					id: this.inputData?.id ?? '',
					firstname: this.formGroup.value.firstname ?? '',
					lastname: this.formGroup.value.lastname ?? '',
					groupid: this.formGroup.value.group ?? '',
				})
				.subscribe(this.closeObserver);
		} else {
			this.accountService
				.create({
					firstname: this.formGroup.value.firstname ?? '',
					lastname: this.formGroup.value.lastname ?? '',
					groupid: this.formGroup.value.group ?? '',
				})
				.subscribe(this.closeObserver);
		}
	};
}

@Component({
	selector: 'orda-account-deposit-dialog',
	imports: [
		ReactiveFormsModule,
		DialogTemplateComponent,
		MatFormFieldModule,
		MatButtonToggleModule,
		MatInputModule,
		OrdaCurrencyPipe,
	],
	template: `
		<orda-dialog-template
			[customTemplate]="template"
			[form]="formGroup"
			(submitClick)="submit()"
		></orda-dialog-template>
		<ng-template #template>
			<form [formGroup]="formGroup">
				<mat-button-toggle-group formControlName="amount" aria-label="Font Style">
					@for (val of DEPOSIT_VALUES; track val) {
						<mat-button-toggle [value]="val">{{ val | currency }}</mat-button-toggle>
					}
				</mat-button-toggle-group>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AccountDepositDialogComponent extends DialogTemplateComponent<Account> {
	accountService = inject(AccountService);

	formGroup = new FormGroup({
		amount: new FormControl(0, [Validators.required]),
	});

	constructor() {
		super();
	}

	public submit = () => {
		this.accountService
			.deposit(this.inputData?.id ?? '', {
				amount: this.formGroup.value.amount ?? 0,
				userid: 'anon',
				history_type: 0,
				deposit_type: 0,
			})
			.subscribe(this.closeObserver);
	};
	protected readonly DEPOSIT_VALUES = DEPOSIT_VALUES;
}
