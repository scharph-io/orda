import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '@orda.features/data-access/services/transaction.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';

@Component({
	selector: 'orda-history',
	providers: [provideNativeDateAdapter()],
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		ReactiveFormsModule,
		OrdaCurrencyPipe,
	],
	template: `
		<mat-form-field>
			<mat-label>Datum auswählen</mat-label>
			<input matInput [matDatepicker]="picker" [formControl]="date" />
			<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
			<mat-datepicker #picker></mat-datepicker>
		</mat-form-field>

		<h2>Zusammenfassung</h2>
		<p>Gesamteinnahmen: {{ summary.value()?.total | currency }}</p>

		<h2>Transaktionen</h2>
		@let obj = data.value();
		@for (item of obj; track item.transaction_id) {
			<p>{{ item.total | currency }}; items: {{ item.items_length }}</p>
		} @empty {
			leer
		}
	`,
	styles: ``,
})
export class HistoryComponent implements OnInit {
	transactionService = inject(TransactionService);

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

	ngOnInit() {}
}
