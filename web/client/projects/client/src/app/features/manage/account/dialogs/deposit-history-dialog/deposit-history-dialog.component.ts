import { Component, inject } from '@angular/core';
import { AccountHistoryService } from '@orda.features/data-access/services/account/account-history.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Account } from '@orda.core/models/account';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { filter, map } from 'rxjs';

@Component({
	imports: [DatePipe, OrdaCurrencyPipe],
	template: `
		<ul>
			@for (h of history(); track h.id) {
				<li>
					<div class="dialog-flex">
						<span class="date">{{ h.created_at | date: 'dd.MM.yyyy HH:mm' }}</span>
						<p>
							<span class="amount">{{ h.amount | currency }}</span> |
							<span class="comment">{{ h.comment }}</span>
						</p>
					</div>
				</li>
			}
		</ul>
	`,
	styleUrl: './deposit-history-dialog.component.scss',
})
export class DepositHistoryDialogComponent {
	protected readonly account = inject<Account>(MAT_DIALOG_DATA);
	protected readonly dialogRef: MatDialogRef<DepositHistoryDialogComponent> = inject(MatDialogRef);
	private readonly accounthistoryService = inject(AccountHistoryService);

	history = toSignal(
		this.accounthistoryService.read(this.account.id).pipe(
			map((h) => h.filter((h) => h.history_type === 1)),
			filter((h) => !!h),
		),
	);
}
