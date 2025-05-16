import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { ViewProduct } from '@orda.core/models/view';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'orda-view-details',
	imports: [MatTableModule, MatCheckboxModule, MatButton, MatFormField, MatInput, MatLabel],
	template: `
		<div class="title">
			<h1>{{ view.value()?.name }}</h1>
			<p>{{ view.value()?.desc }}</p>
		</div>

		<mat-form-field style="margin: 0 0.5rem">
			<mat-label>Filter</mat-label>
			<input matInput (keyup)="applyFilter($event)" #input />
		</mat-form-field>
		<button mat-button (click)="save()">Save</button>
		<div class="mat-elevation-z8 table-container">
			<table
				mat-table
				[dataSource]="availableProductsDataSource()"
				[style]="{ 'max-height': '20vh', overflow: 'auto' }"
			>
				<ng-container matColumnDef="select">
					<th mat-header-cell *matHeaderCellDef>
						<mat-checkbox
							(change)="$event ? toggleAllRows() : null"
							[checked]="selection().hasValue() && isAllSelected()"
							[indeterminate]="selection().hasValue() && !isAllSelected()"
						>
						</mat-checkbox>
					</th>
					<td mat-cell *matCellDef="let row">
						<mat-checkbox
							(click)="$event.stopPropagation()"
							(change)="$event ? selection().toggle(row.id) : null"
							[checked]="selection().isSelected(row.id)"
						>
						</mat-checkbox>
					</td>
				</ng-container>
				<!-- Position Column -->
				<ng-container matColumnDef="name">
					<th mat-header-cell *matHeaderCellDef>Name</th>
					<td mat-cell *matCellDef="let element">{{ element.name }}</td>
				</ng-container>

				<!-- Name Column -->
				<ng-container matColumnDef="desc">
					<th mat-header-cell *matHeaderCellDef>Desc</th>
					<td mat-cell *matCellDef="let element">{{ element.desc }}</td>
				</ng-container>

				<!-- Weight Column -->
				<ng-container matColumnDef="group">
					<th mat-header-cell *matHeaderCellDef>Group</th>
					<td mat-cell *matCellDef="let element">{{ getGroupName(element.group_id) }}</td>
				</ng-container>

				<ng-container matColumnDef="color">
					<th mat-header-cell *matHeaderCellDef>Color</th>
					<td mat-cell *matCellDef="let element" [id]="element.id">{{ element.color }}</td>
				</ng-container>

				<!--			&lt;!&ndash; Symbol Column &ndash;&gt;-->
				<!--			<ng-container matColumnDef="actions">-->
				<!--				<th mat-header-cell *matHeaderCellDef>Actions</th>-->
				<!--				<td mat-cell *matCellDef="let element">{{ element.active }}</td>-->
				<!--			</ng-container>-->

				<tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
				<tr mat-row *matRowDef="let row; columns: displayedColumns" [id]="row.id"></tr>

				<!-- Row shown when there is no matching data. -->
				<tr class="mat-row" *matNoDataRow>
					<td class="mat-cell" colspan="4">No data matching the filter "{{ input.value }}"</td>
				</tr>
			</table>
		</div>
	`,
	styles: `
		/* app.component.scss */
		.title {
			display: flex;
			flex-direction: row;
			align-items: baseline;
			gap: 0.5rem;
		}

		.table-container {
			/*--mat-table-row-item-container-height: 2rem;*/

			height: 75vh; /* Set your desired fixed height here */
			overflow: auto;
			width: 100%;
			margin: 0 0.5rem;
		}
	`,
})
export class ViewDetailsComponent {
	displayedColumns: string[] = ['select', 'name', 'desc', 'group'];

	private logger = inject(OrdaLogger);
	private viewService = inject(ViewService);
	private assortmentService = inject(AssortmentService);

	private readonly snackBar = inject(MatSnackBar);

	view_id = signal<string>(inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '');

	view = rxResource({
		request: () => this.view_id(),
		loader: ({ request }) => this.viewService.readById(request),
	});

	availableProducts = rxResource({
		loader: () => this.assortmentService.readProducts(),
	});
	availableProductsDataSource = computed(
		() => new MatTableDataSource(this.availableProducts.value() ?? []),
	);

	viewProducts = rxResource({
		loader: () => this.viewService.getProducts(this.view_id()),
	});

	selection = computed(
		() =>
			new SelectionModel<string>(
				true,
				(this.viewProducts.value() ?? []).map((p) => p.id),
			),
	);

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.availableProductsDataSource().filter = filterValue.trim().toLowerCase();
		this.availableProductsDataSource().filterPredicate = (data, filter) =>
			data.name.toLowerCase().includes(filter) ||
			data.desc?.toLowerCase().includes(filter) ||
			this.getGroupName(data.group_id ?? '')
				.toLowerCase()
				.includes(filter);
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection().selected.length;
		const numRows = this.availableProductsDataSource().data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	toggleAllRows() {
		if (this.isAllSelected()) {
			this.selection().clear();
			return;
		}
		this.selection().select(...this.availableProductsDataSource().data.map((s) => s.id));
	}

	save() {
		const viewProductsToSave = this.selection().selected.map(
			(p) =>
				({
					product_id: p,
				}) as Partial<ViewProduct>,
		);

		this.viewService.setProducts(this.view_id(), viewProductsToSave).subscribe({
			next: () => {
				this.logger.debug(
					`successfully saved ${viewProductsToSave.length} products to view ${this.view_id()}`,
				);
				this.snackBar.open('Successfully saved products to view', 'Close', {
					duration: 3000,
				});
			},
			error: (err) => {
				this.logger.error(
					`failed saving ${viewProductsToSave.length} products to view ${this.view_id()}, ${err}`,
				);
			},
		});
	}

	getGroupName(group_id: string): string {
		return this.assortmentService.groups.value()?.find((g) => g.id === group_id)?.name ?? '';
	}
}
