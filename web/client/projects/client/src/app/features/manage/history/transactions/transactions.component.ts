import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell,
	MatHeaderCellDef,
	MatHeaderRow,
	MatRow,
	MatTableDataSource,
	MatTableModule,
} from '@angular/material/table';
import { TransactionService } from '@orda.features/data-access/services/transaction.service';
import { PaymentOption, PaymentOptionKeys } from '@orda.features/order/utils/transaction';

import { rxResource } from '@angular/core/rxjs-interop';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
	selector: 'orda-transactions',
	imports: [
		DatePipe,
		MatCell,
		MatTableModule,
		MatRow,
		MatHeaderRow,
		MatColumnDef,
		MatHeaderCell,
		MatCellDef,
		MatHeaderCellDef,
		OrdaCurrencyPipe,
		MatIcon,
		MatIconButton,
	],
	template: `
		@if (data.value()) {
			@let d = data.value() ?? [];
			<div style="display: flex; flex-direction: row; justify-content: space-between">
				<p>{{ d.length }} {{ d.length === 1 ? 'Transaktion' : 'Transaktionen' }}</p>
				@if (d.length > 0) {
					<p>
						{{ d[0].created_at | date: 'medium' }} -
						{{ d[d.length - 1].created_at | date: 'medium' }}
					</p>
				}
			</div>
			@if (d.length > 0) {
				<table mat-table [dataSource]="dataSource()" class="mat-elevation-z8">
					<ng-container matColumnDef="created">
						<th mat-header-cell *matHeaderCellDef>Created</th>
						<td mat-cell *matCellDef="let element">{{ element.created_at | date: 'medium' }}</td>
					</ng-container>

					<ng-container matColumnDef="payment_option">
						<th mat-header-cell *matHeaderCellDef>Payment Option</th>
						<td mat-cell *matCellDef="let element">
							{{ PaymentOptionKeys[keyToNumber(element.payment_option)] }}
						</td>
					</ng-container>

					<ng-container matColumnDef="total">
						<th mat-header-cell *matHeaderCellDef>Total</th>
						<td mat-cell *matCellDef="let element">{{ element.total | currency }}</td>
					</ng-container>

					<ng-container matColumnDef="account">
						<th mat-header-cell *matHeaderCellDef>Account</th>
						<td mat-cell *matCellDef="let element">{{ element.account_name }}</td>
					</ng-container>

					<ng-container matColumnDef="actions">
						<th mat-header-cell *matHeaderCellDef>Actions</th>
						<td mat-cell *matCellDef="let element">
							<button mat-icon-button disabled>
								<mat-icon>info</mat-icon>
							</button>
						</td>
					</ng-container>

					<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
					<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
				</table>
			}
		}
	`,
	styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
	transactionService = inject(TransactionService);

	PaymentOptionKeys = PaymentOptionKeys;

	readonly date = input.required<string>();

	data = rxResource({
		request: () => this.date(),
		loader: ({ request }) => this.transactionService.getTransactionsByDate(request ?? undefined),
	});

	displayedColumns: string[] = ['created', 'payment_option', 'account', 'total', 'actions'];
	dataSource = computed(() => {
		return new MatTableDataSource(this.data.value());
	});

	keyToNumber = (key: string | number) => {
		return Number(key) as PaymentOption;
	};
}
