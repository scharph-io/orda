import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'orda-view-details',
	imports: [MatTableModule, MatCheckboxModule, MatButton, MatIcon],
	template: `
		<div class="title">
			<h2>{{ view.value()?.name }}</h2>
			@if (view.value()?.desc !== '') {
				<p>{{ view.value()?.desc }} {{ view_id() }}</p>
			}
		</div>
		<table mat-table [dataSource]="productsDataSource()">
			<ng-container matColumnDef="pos">
				<th mat-header-cell *matHeaderCellDef>Position</th>
				<td mat-cell *matCellDef="let element">{{ element.position }}</td>
			</ng-container>
			<ng-container matColumnDef="name">
				<th mat-header-cell *matHeaderCellDef>Name</th>
				<td mat-cell *matCellDef="let element">{{ element.name }}</td>
			</ng-container>

			<ng-container matColumnDef="desc">
				<th mat-header-cell *matHeaderCellDef>Description</th>
				<td mat-cell *matCellDef="let element">{{ element.desc }}</td>
			</ng-container>

			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Actions</th>
				<td mat-cell *matCellDef="let element">
					<button mat-button (click)="removeProduct(element.id)">
						<mat-icon>delete</mat-icon>
					</button>
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns" [id]="row.id"></tr>
		</table>
	`,
	styles: `
		.title {
			display: flex;
			flex-direction: row;
			align-items: baseline;
			gap: 0.5rem;
		}
	`,
})
export class ViewDetailsComponent {
	displayedColumns: string[] = ['pos', 'name', 'desc', 'actions'];

	viewService = inject(ViewService);

	view_id = signal<string>(inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '');
	view = rxResource({
		request: () => this.view_id(),
		loader: ({ request }) => this.viewService.readById(request),
	});

	viewProducts = rxResource({
		loader: () => this.viewService.getProducts(this.view_id()),
	});
	productsDataSource = computed(() => new MatTableDataSource(this.viewProducts.value() ?? []));

	removeProduct(productId: string) {
		this.viewService.removeProduct(this.view_id(), productId).subscribe(() => {
			this.viewProducts.reload();
		});
	}

	setPosition(productId: string, position: number) {
		// this.viewService.setPosition(this.view_id(), productId, position).subscribe(() => {
		// 	this.viewProducts.reload();
		// });
	}

	openColorDialog(productId: string) {
		// this.viewService.openColorDialog(this.view_id(), productId).subscribe(() => {
		// 	this.viewProducts.reload();
		// });
	}
}
