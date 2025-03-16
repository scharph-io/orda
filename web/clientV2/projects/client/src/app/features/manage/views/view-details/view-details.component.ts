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
import { map } from 'rxjs';
import { ViewProduct } from '@orda.core/models/view';
import { OrdaLogger } from '@orda.shared/services/logger.service';

@Component({
	selector: 'orda-view-details',
	imports: [MatTableModule, MatCheckboxModule, MatButton, MatFormField, MatInput, MatLabel],
	template: `
		<button mat-button (click)="save()">Save</button>
		<mat-form-field>
			<mat-label>Filter</mat-label>
			<input matInput (keyup)="applyFilter($event)" placeholder="Ex. ium" #input />
		</mat-form-field>
		<table mat-table [dataSource]="availableProductsDataSource()">
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
				<td mat-cell *matCellDef="let element">{{ element.name }} {{ element.id }}</td>
			</ng-container>

			<!-- Name Column -->
			<ng-container matColumnDef="desc">
				<th mat-header-cell *matHeaderCellDef>Desc</th>
				<td mat-cell *matCellDef="let element">{{ element.desc }}</td>
			</ng-container>

			<!-- Weight Column -->
			<ng-container matColumnDef="group">
				<th mat-header-cell *matHeaderCellDef>Group</th>
				<td mat-cell *matCellDef="let element">{{ element.group_id }}</td>
			</ng-container>

			<!-- Symbol Column -->
			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Actions</th>
				<td mat-cell *matCellDef="let element">{{ element.active }}</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

			<!-- Row shown when there is no matching data. -->
			<tr class="mat-row" *matNoDataRow>
				<td class="mat-cell" colspan="4">No data matching the filter "{{ input.value }}"</td>
			</tr>
		</table>
	`,
	styles: ``,
})
export class ViewDetailsComponent {
	displayedColumns: string[] = ['select', 'name', 'desc', 'group', 'actions'];

	private logger = inject(OrdaLogger);
	private viewService = inject(ViewService);
	private assortmentService = inject(AssortmentService);

	view_id = signal<string>(inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '');

	availableProducts = rxResource({
		loader: () => this.assortmentService.readProducts(),
	});
	availableProductsDataSource = computed(
		() => new MatTableDataSource(this.availableProducts.value() ?? []),
	);

	viewProductIds = rxResource({
		loader: () =>
			this.viewService.getProducts(this.view_id()).pipe(map((vps) => vps.map((vp) => vp.id))),
	});

	selection = computed(() => new SelectionModel<string>(true, this.viewProductIds.value() ?? []));

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.availableProductsDataSource().filter = filterValue.trim().toLowerCase();
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
		const viewProducts = this.selection().selected.map(
			(p, i) =>
				({
					product_id: p,
					color: '', // FIX ME
					position: (this.viewProductIds.value() ?? []).length + i,
				}) as Partial<ViewProduct>,
		);
		this.viewService.setProducts(this.view_id(), viewProducts).subscribe({
			next: () => {
				this.logger.debug(
					`successfully saved ${viewProducts.length} products to view ${this.view_id()}`,
				);
			},
			error: (err) => {
				this.logger.error(
					`failed saving ${viewProducts.length} products to view ${this.view_id()}, ${err}`,
				);
			},
		});
	}
}
