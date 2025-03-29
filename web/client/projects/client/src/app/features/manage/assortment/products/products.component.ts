import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrdaCurrencyPipe } from '@orda.shared/pipes/currency.pipe';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { AssortmentProduct, GroupDeposit } from '@orda.core/models/assortment';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { MatSelectModule } from '@angular/material/select';
import { AssortmentService } from '@orda.features/data-access/services/assortment/assortment.service';
import { filter, switchMap } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DepositDialogComponent } from './deposit-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'orda-assortment-view-details',
	template: `
		<h2>{{ group.value()?.name }}</h2>
		@if (group.value(); as g) {
			<div class="title-toolbar">
				<button mat-button (click)="create()">New</button>

				<button
					mat-flat-button
					(click)="openDepositDialog()"
					[ngClass]="g.deposit ? (g.deposit.active ? 'active-btn' : 'inactive-btn') : ''"
				>
					Deposit
					@if (g.deposit) {
						{{ g.deposit.price | currency }}
					}
				</button>
			</div>
			<mat-form-field>
				<mat-label>Filter</mat-label>
				<input matInput (keyup)="applyFilter($event)" #input />
				@if (input.value) {
					<button matSuffix mat-icon-button aria-label="Clear" (click)="input.value = ''">
						<mat-icon>close</mat-icon>
					</button>
				}
			</mat-form-field>

			<div class="mat-elevation-z8">
				<table mat-table [dataSource]="dataSource()" matSort>
					<ng-container matColumnDef="name">
						<th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
						<td mat-cell *matCellDef="let row">{{ row.name }}</td>
					</ng-container>

					<ng-container matColumnDef="desc">
						<th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
						<td mat-cell *matCellDef="let row">{{ row.desc }}</td>
					</ng-container>

					<ng-container matColumnDef="price">
						<th mat-header-cell *matHeaderCellDef mat-sort-header>Balance</th>
						<td mat-cell *matCellDef="let row">{{ row.price | currency }}</td>
					</ng-container>
					<ng-container matColumnDef="active">
						<th mat-header-cell *matHeaderCellDef mat-sort-header>Active</th>
						<td mat-cell *matCellDef="let row">
							<mat-slide-toggle [(ngModel)]="row.active" (change)="toggleProduct(row.id)" />
						</td>
					</ng-container>

					<ng-container matColumnDef="actions">
						<th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
						<td mat-cell *matCellDef="let row">
							<button mat-icon-button (click)="delete(row)">
								<mat-icon>delete</mat-icon>
							</button>
							<button mat-icon-button (click)="edit(row)">
								<mat-icon>edit</mat-icon>
							</button>
							<button mat-icon-button (click)="duplicate(row)">
								<mat-icon>control_point_duplicate</mat-icon>
							</button>
							<!--						<button mat-icon-button (click)="deposit(row)">-->
							<!--							<mat-icon>add_business</mat-icon>-->
							<!--						</button>-->
							<!--						<button mat-icon-button (click)="info(row)">-->
							<!--							<mat-icon>info</mat-icon>-->
							<!--						</button>-->
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
		} @else {
			loading...
		}
	`,
	imports: [
		CommonModule,
		MatButtonModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatFormFieldModule,
		MatInputModule,
		OrdaCurrencyPipe,
		RouterModule,
		MatIcon,
		MatSlideToggle,
		FormsModule,
	],
	styles: `
		.title-toolbar {
			display: flex;
			justify-content: start;
			align-items: center;
		}
	`,
})
export class AssortmentProductsComponent extends EntityManager<AssortmentProduct> {
	displayedColumns: string[] = ['name', 'desc', 'price', 'active', 'actions'];
	private logger = inject(OrdaLogger);

	private readonly route = inject(ActivatedRoute);
	assortmentService = inject(AssortmentService);

	group_id = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');
	group = rxResource({
		request: () => this.group_id(),
		loader: ({ request }) => this.assortmentService.readGroupById(request),
	});

	products = rxResource({
		loader: () => this.assortmentService.readProducts(this.group_id()),
	});

	dataSource = computed(() => new MatTableDataSource(this.products.value() ?? []));

	public override create(): void {
		this.dialogClosed<
			AssortmentProductDialogComponent,
			{ group: string; data?: AssortmentProduct },
			AssortmentProduct
		>(AssortmentProductDialogComponent, { group: this.group_id() }).subscribe(() =>
			this.products.reload(),
		);
	}

	public override delete(p: AssortmentProduct): void {
		this.assortmentService
			.readProductById(p.id ?? '')
			.pipe(
				switchMap((p) =>
					this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
						ConfirmDialogComponent,
						{
							message: p.name,
						},
					),
				),
			)
			.pipe(
				filter((res) => res),
				switchMap(() => this.assortmentService.removeProduct(p.id)),
			)
			.subscribe({
				next: () => {
					this.products.reload();
				},
				error: (err) => this.logger.error(err),
			});
	}

	public override edit(p: AssortmentProduct): void {
		this.dialogClosed<
			AssortmentProductDialogComponent,
			{ group: string; data?: AssortmentProduct },
			AssortmentProduct
		>(AssortmentProductDialogComponent, { group: this.group_id(), data: p }).subscribe(() =>
			this.products.reload(),
		);
	}

	public duplicate(p: AssortmentProduct): void {
		this.dialogClosed<
			AssortmentProductDialogComponent,
			{ group: string; data?: AssortmentProduct; duplicate: boolean },
			AssortmentProduct
		>(AssortmentProductDialogComponent, {
			group: this.group_id(),
			data: p,
			duplicate: true,
		}).subscribe(() => this.products.reload());
	}

	protected toggleProduct(id: string) {
		this.assortmentService.toggleProduct(id).subscribe(() => this.products.reload());
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource().filter = filterValue.trim().toLowerCase();
		if (this.dataSource().paginator) {
			this.dataSource().paginator?.firstPage();
		}
	}

	openDepositDialog() {
		this.dialogClosed<
			DepositDialogComponent,
			{ groupId: string; deposit: GroupDeposit | undefined },
			number
		>(DepositDialogComponent, {
			groupId: this.group_id(),
			deposit: this.group.value()?.deposit,
		}).subscribe(() => this.group.reload());
	}
}

@Component({
	selector: 'orda-assortment-product-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		DialogTemplateComponent,
		MatLabel,
		MatFormFieldModule,
		MatInput,
		MatSelectModule,
		MatSlideToggle,
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
						<mat-label>Name</mat-label>
						<input matInput formControlName="name" />
					</mat-form-field>
					<mat-form-field>
						<mat-label>Description</mat-label>
						<input matInput formControlName="desc" />
					</mat-form-field>
					<mat-form-field>
						<mat-label>Price</mat-label>
						<input type="number" matInput formControlName="price" />
					</mat-form-field>
					<mat-slide-toggle formControlName="active">Active</mat-slide-toggle>
				</div>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AssortmentProductDialogComponent extends DialogTemplateComponent<
	{
		group: string;
		data?: AssortmentProduct;
		duplicate?: boolean;
	},
	AssortmentProduct
> {
	assortmentService = inject(AssortmentService);

	formGroup = new FormGroup({
		name: new FormControl('', [
			Validators.required,
			Validators.maxLength(10),
			Validators.minLength(3),
		]),
		desc: new FormControl('', [
			Validators.required,
			Validators.maxLength(10),
			Validators.minLength(3),
		]),
		price: new FormControl(0, [Validators.required]),
		active: new FormControl(true, Validators.requiredTrue),
	});

	constructor() {
		super();

		this.formGroup.patchValue({
			name: this.inputData.data?.name,
			desc: this.inputData.data?.desc,
			price: this.inputData.data?.price,
			active: this.inputData.data?.active,
		});
	}

	public submit = () => {
		if (this.inputData.duplicate) {
			this.assortmentService
				.addProducts(this.inputData.group, [
					{
						name: this.trim(this.formGroup.value.name ?? ''),
						desc: this.trim(this.formGroup.value.desc ?? ''),
						price: this.formGroup.value.price ?? 0,
						active: this.formGroup.value.active ?? false,
					},
				])
				.subscribe(this.closeObserver);
			return;
		}

		if (this.inputData.data) {
			this.assortmentService
				.updateProduct(this.inputData.data?.id ?? '', {
					name: this.trim(this.formGroup.value.name ?? ''),
					desc: this.trim(this.formGroup.value.desc ?? ''),
					price: this.formGroup.value.price ?? 0,
					active: this.formGroup.value.active ?? false,
				})
				.subscribe(this.closeObserver);
		} else {
			this.assortmentService
				.addProducts(this.inputData.group, [
					{
						name: this.formGroup.value.name ?? '',
						desc: this.formGroup.value.desc ?? '',
						price: this.formGroup.value.price ?? 0,
						active: this.formGroup.value.active ?? false,
					},
				])
				.subscribe(this.closeObserver);
		}
	};
}
