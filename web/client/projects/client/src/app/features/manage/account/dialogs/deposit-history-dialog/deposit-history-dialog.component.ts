import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AccountHistoryService } from '@orda.features/data-access/services/account/account-history.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Account } from '@orda.core/models/account';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { filter, map } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DatePipe, OrdaCurrencyPipe, MatTableModule, MatDialogModule],
	template: `
		<h2 mat-dialog-title>Einzahlungsverlauf</h2>
		<mat-dialog-content class="mat-typography">
			<table mat-table [dataSource]="dataSource()" class="mat-elevation-z8">
				<ng-container matColumnDef="date">
					<th mat-header-cell *matHeaderCellDef>Datum</th>
					<td mat-cell *matCellDef="let element">
						{{ element.created_at | date: 'dd.MM.yyyy HH:mm' }}
					</td>
				</ng-container>

				<ng-container matColumnDef="amount">
					<th mat-header-cell *matHeaderCellDef>Betrag</th>
					<td mat-cell *matCellDef="let element">{{ element.amount | currency }}</td>
				</ng-container>

				<ng-container matColumnDef="comment">
					<th mat-header-cell *matHeaderCellDef>Kommentar</th>
					<td mat-cell *matCellDef="let element">{{ element.comment }}</td>
				</ng-container>

				<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
				<tr mat-row *matRowDef="let row; columns: displayedColumns" [id]="row.id"></tr>
			</table>
		</mat-dialog-content>
	`,
	styleUrl: './deposit-history-dialog.component.scss',
})
export class DepositHistoryDialogComponent {
	protected readonly account = inject<Account>(MAT_DIALOG_DATA);
	protected readonly dialogRef: MatDialogRef<DepositHistoryDialogComponent> = inject(MatDialogRef);
	displayedColumns: string[] = ['date', 'amount', 'comment'];
	dataSource = computed(() => new MatTableDataSource(this.history()));
	private readonly accountHistoryService = inject(AccountHistoryService);
	history = toSignal(
		this.accountHistoryService.read(this.account.id).pipe(
			map((h) => h.filter((h) => h.history_type === 1).slice(0, 10)),
			filter((h) => !!h),
		),
	);
}
