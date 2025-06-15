import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Account } from '@orda.core/models/account';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { AccountService } from '@orda.features/data-access/services/account/account.service';
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
import { AccountDetailDialogComponent } from '@orda.features/manage/account/dialogs/account-detail-dialog/account-detail-dialog.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountGroupService } from '@orda.features/data-access/services/account/account-group.service';
import { TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { AccountGroupComponent } from '@orda.features/manage/account/group/group.component';
import { MatMenuModule } from '@angular/material/menu';
import { AccountCorrectionDialogComponent } from '@orda.features/manage/account/dialogs/account-correction-dialog/account-correction-dialog.component';
import { DepositHistoryDialogComponent } from '@orda.features/manage/account/dialogs/deposit-history-dialog/deposit-history-dialog.component';

export enum HistoryAction {
	Debit = 0,
	Deposit = 1,
	Correction = 2,
	Reset = 3,
}

export enum DepositType {
	Free = 0,
	Cash = 1,
}

@Component({
	selector: 'orda-account',
	imports: [
		MatButtonModule,
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
		MatMenuModule,
	],
	template: `
		<mat-tab-group
			mat-stretch-tabs="false"
			mat-align-tabs="start"
			animationDuration="0ms"
			style="margin: 0 0.5rem"
		>
			<mat-tab label="Konten">
				<mat-form-field>
					<mat-label>Filter</mat-label>
					<input matInput (keyup)="applyFilter($event)" #input />
				</mat-form-field>
				<button mat-button (click)="create()">Neu</button>
				<button mat-icon-button (click)="groupDeposit()">
					<mat-icon>group_add</mat-icon>
				</button>
				<div class="mat-elevation-z8">
					<table mat-table [dataSource]="dataSource()" matSort>
						<ng-container matColumnDef="name">
							<th mat-header-cell *matHeaderCellDef mat-sort-header>Vorname</th>
							<td mat-cell *matCellDef="let row">{{ row.lastname }} {{ row.firstname }}</td>
						</ng-container>

						<ng-container matColumnDef="group">
							<th mat-header-cell *matHeaderCellDef mat-sort-header>Gruppe</th>
							<td mat-cell *matCellDef="let row">{{ row.group }}</td>
						</ng-container>

						<ng-container matColumnDef="main-balance">
							<th mat-header-cell *matHeaderCellDef mat-sort-header>Geldbetrag</th>
							<td mat-cell *matCellDef="let row">{{ row.main_balance | currency }}</td>
						</ng-container>

						<ng-container matColumnDef="credit-balance">
							<th mat-header-cell *matHeaderCellDef mat-sort-header>Betrag</th>
							<td mat-cell *matCellDef="let row">{{ row.credit_balance | currency }}</td>
						</ng-container>

						<ng-container matColumnDef="actions">
							<th mat-header-cell *matHeaderCellDef mat-sort-header style="width: 2rem"></th>
							<td mat-cell *matCellDef="let row" [id]="row.id" style="width: 2rem">
								<button
									style="float: right"
									mat-icon-button
									[matMenuTriggerFor]="menu"
									aria-label="Account menu actions"
								>
									<mat-icon>more_vert</mat-icon>
								</button>
								<mat-menu #menu="matMenu">
									<button mat-menu-item [matMenuTriggerFor]="creditMenu">
										<mat-icon>price_change</mat-icon>
										<span>Guthaben</span>
									</button>
									<button mat-menu-item (click)="info(row)">
										<mat-icon>info</mat-icon>
										<span>Info</span>
									</button>
									<button mat-menu-item (click)="edit(row)">
										<mat-icon>edit</mat-icon>
										<span>Bearbeiten</span>
									</button>
									<button
										class="delete-btn"
										mat-menu-item
										(click)="delete(row)"
										[disabled]="hasMainBalance(row)"
									>
										<mat-icon>delete</mat-icon>
										<span>Löschen</span>
									</button>
								</mat-menu>
								<mat-menu #creditMenu="matMenu">
									<button mat-menu-item (click)="deposit(row)">
										<mat-icon>add_circle</mat-icon>
										<span>Aufbuchen</span>
									</button>
									<button mat-menu-item (click)="correction(row)">
										<mat-icon>edit_note</mat-icon>
										<span>Korrektur</span>
									</button>
									<button mat-menu-item (click)="openDepositHistory(row)">
										<mat-icon>history</mat-icon>
										<span>Verlauf</span>
									</button>
								</mat-menu>
							</td>
						</ng-container>

						<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
						<tr mat-row *matRowDef="let row; columns: displayedColumns" [id]="row.id"></tr>

						<!-- Row shown when there is no matching data. -->
						<tr class="mat-row" *matNoDataRow>
							<td class="mat-cell" colspan="4">No data matching the filter "{{ input.value }}"</td>
						</tr>
					</table>
				</div>
			</mat-tab>
			<mat-tab label="Gruppen">
				<ng-template matTabContent>
					<orda-account-groups />
				</ng-template>
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
		stream: () =>
			this.accountService
				.read()
				.pipe(map((res) => res.sort((a, b) => a.lastname.localeCompare(b.lastname)))),
	});

	dataSource = computed(() => new MatTableDataSource(this.data.value() ?? []));

	constructor() {
		super();
	}

	// displayedColumns: string[] = ['name', 'group', 'main-balance', 'credit-balance', 'actions'];
	displayedColumns: string[] = ['name', 'group', 'credit-balance', 'actions'];

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

	correction(acc: Account) {
		this.dialogClosed<AccountCorrectionDialogComponent, Account, Account>(
			AccountCorrectionDialogComponent,
			acc,
		).subscribe(() => this.data.reload());
	}

	openDepositHistory(acc: Account) {
		const dialogRef = this.dialog.open<DepositHistoryDialogComponent, Account, undefined>(
			DepositHistoryDialogComponent,
			{
				width: '30rem',
				data: acc,
			},
		);

		dialogRef.afterClosed().subscribe(() => {
			this.logger.debug('Deposit history dialog closed');
			this.data.reload();
		});
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
				<div class="dialog-flex">
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
				</div>
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
			[title]="'Buchung'"
		></orda-dialog-template>
		<ng-template #template>
			<form [formGroup]="formGroup">
				<mat-button-toggle-group formControlName="amount" aria-label="Font Style">
					@for (val of DEPOSIT_VALUES; track val) {
						<mat-button-toggle [value]="val">{{ val | currency }}</mat-button-toggle>
					}
					<mat-button-toggle [value]="-1">Eigen</mat-button-toggle>
				</mat-button-toggle-group>
				@if (formGroup.value.amount === -1) {
					<mat-form-field>
						<mat-label>Betrag</mat-label>
						<input matInput type="number" formControlName="customAmount" />
					</mat-form-field>
				}
				<mat-form-field>
					<mat-label>Kommentar</mat-label>
					<input matInput type="string" formControlName="reason" placeholder="Optional" />
				</mat-form-field>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AccountDepositDialogComponent extends DialogTemplateComponent<Account> {
	accountService = inject(AccountService);

	formGroup = new FormGroup({
		amount: new FormControl(0, [Validators.required]),
		customAmount: new FormControl(0, [Validators.required]),
		reason: new FormControl(''),
	});

	constructor() {
		super();
	}

	public submit = () => {
		if (this.formGroup.value?.amount) {
			if (this.formGroup.value.amount == -1) {
				this.formGroup.patchValue({
					amount: this.formGroup.value.customAmount,
				});

				this.accountService
					.deposit(this.inputData?.id ?? '', {
						amount: this.formGroup.value.customAmount ?? 0,
						history_action: HistoryAction.Deposit,
						deposit_type: DepositType.Free,
						reason: this.formGroup.value.reason ?? '',
					})
					.subscribe(this.closeObserver);
			} else {
				this.accountService
					.deposit(this.inputData?.id ?? '', {
						amount: this.formGroup.value.amount ?? 0,
						history_action: HistoryAction.Deposit,
						deposit_type: DepositType.Free,
						reason: this.formGroup.value.reason ?? '',
					})
					.subscribe(this.closeObserver);
			}
		}
	};
	protected readonly DEPOSIT_VALUES = DEPOSIT_VALUES;
}
