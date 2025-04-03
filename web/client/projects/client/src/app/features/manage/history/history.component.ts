import { Component, inject } from '@angular/core';
import { TransactionService } from '@orda.features/data-access/services/transaction.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { PaymentOption, PaymentOptionKeys } from '@orda.features/order/utils/transaction';

@Component({
	selector: 'orda-history',
	providers: [provideNativeDateAdapter()],
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		ReactiveFormsModule,
		OrdaCurrencyPipe,
		DatePipe,
		KeyValuePipe,
	],
	template: `
		<mat-form-field>
			<mat-label>Datum auswählen</mat-label>
			<input matInput [matDatepicker]="picker" [formControl]="date" />
			<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
			<mat-datepicker #picker></mat-datepicker>
		</mat-form-field>

		<h2>Zusammenfassung</h2>
		<h3>Einnahmen</h3>
		@for (total of summary.value()?.totals | keyvalue; track total) {
			<p>
				{{ PaymentOptionKeys[keyToNumber(total.key)] }}:
				{{ total.value | currency }}
			</p>
		}

		<h2>Transaktionen</h2>
		@let obj = data.value();
		@for (item of obj; track item.transaction_id) {
			<p>
				{{ item.created_at | date: 'medium' }} |
				{{ PaymentOptionKeys[keyToNumber(item.payment_option)] }} - {{ item.total | currency }} |
				@if (item.account_id) {
					AccountId: {{ item.account_id }}
				}
			</p>
		} @empty {
			leer
		}
	`,
	styles: ``,
})
export class HistoryComponent {
	transactionService = inject(TransactionService);

	PaymentOption = PaymentOption;
	PaymentOptionKeys = PaymentOptionKeys;

	readonly date = new FormControl(new Date().toISOString());

	changed = toSignal(this.date.valueChanges.pipe(tap((x) => console.log(x))));

	data = rxResource({
		request: () => this.changed(),
		loader: ({ request }) => this.transactionService.getTransactionsByDate(request ?? undefined),
	});

	summary = rxResource({
		request: () => this.changed(),
		loader: ({ request }) => this.transactionService.getSummaryByDate(request ?? undefined),
	});

	keyToNumber = (key: string | number) => {
		return Number(key) as PaymentOption;
	};
}
