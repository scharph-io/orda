import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, map, switchMap } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { View } from '@orda.core/models/view';
import { MatSelect } from '@angular/material/select';
import { RoleService } from '@orda.features/data-access/services/role.service';
import { MatOption } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ViewBreakpointService } from '@orda.shared/services/view-breakpoint.service';

@Component({
	selector: 'orda-view-list',
	imports: [
		MatButtonModule,
		MatListModule,
		MatIcon,
		TitleCasePipe,
		RouterModule,
		MatGridListModule,
	],
	template: `
		<div class="title-toolbar">
			<h2>View</h2>
			<button mat-button (click)="create()">New</button>
		</div>

		@let views = viewService.entityResource.value() ?? [];

		@if (views.length === 0) {
			<p>No views available. Add <button mat-button (click)="create()">New</button></p>
		} @else {
<!--			<mat-grid-list [cols]="gridCols()" rowHeight="1:1" gutterSize="0.5em">-->
<!--				@for (view of views; track view.id) {-->
<!--					<mat-grid-tile [style]="{ 'background-color': 'lightgrey' }">-->
<!--						<div class="container">-->
<!--							<div-->
<!--								class="title"-->
<!--								[routerLink]="[view.id]"-->
<!--								[state]="{ name: view.name }"-->
<!--								routerLinkActive="router-link-active"-->
<!--							>-->
<!--                <p>{{ view.name | titlecase }}</p>-->
<!--							</div>-->
<!--							<div-->
<!--								class="info"-->
<!--								[routerLink]="[view.id]"-->
<!--								[state]="{ name: view.name }"-->
<!--								routerLinkActive="router-link-active"-->
<!--							>-->
<!--								{{ view.products_count}} products-->
<!--							</div>-->
<!--							<div class="actions">-->
<!--								<button-->
<!--									title="delete view"-->
<!--									class="delete-btn"-->
<!--									mat-icon-button-->
<!--									(click)="delete(view)"-->
<!--								>-->
<!--									<mat-icon>delete</mat-icon>-->
<!--								</button>-->
<!--								<button title="edit" mat-icon-button (click)="edit(view)">-->
<!--									<mat-icon>edit</mat-icon>-->
<!--								</button>-->
<!--							</div>-->
<!--						</div>-->
<!--					</mat-grid-tile>-->
<!--				}-->
<!--			</mat-grid-list>-->
			<mat-list role="list">
				@for (view of views; track view.id) {
					<mat-list-item role="listitem">
						<div class="item">
							<p
								[routerLink]="[view.id]"
								[state]="{ name: view.name }"
								routerLinkActive="router-link-active"
							>
								{{ view.name | titlecase }}
                @if(view.desc !== '') {
                  ({{ view.desc | titlecase }})
                }
							</p>
              <button
                title="delete view"
                class="delete-btn"
                mat-icon-button
                (click)="delete(view)"
              >
                <mat-icon>delete</mat-icon>
              </button>
              <button title="edit assortment group" mat-icon-button (click)="edit(view)">
                <mat-icon>edit</mat-icon>
              </button>

							</div>

					</mat-list-item>
				}
			</mat-list>
		}
	`,
	styles: `
		.item {
			display: flex;
			flex-direction: row;
      align-items: center;
		}

		.title-toolbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}


	`,
})
export class ViewListComponent extends EntityManager<View> {
	viewService = inject(ViewService);
	viewBreakpointService = inject(ViewBreakpointService);
	logger = inject(OrdaLogger);

	gridCols = signal(5);

	constructor() {
		super();
		this.viewBreakpointService.getBreakpoint().subscribe((breakpoint) => {
			console.log('breakpoint', breakpoint);
			if (breakpoint === 'mobile') {
				this.gridCols.set(4);
			} else if (breakpoint === 'tablet') {
				this.gridCols.set(6);
			} else {
				this.gridCols.set(7);
			}
		});
	}

	create() {
		this.dialogClosed<ViewListDialogComponent, undefined, View>(
			ViewListDialogComponent,
			undefined,
		).subscribe(() => this.viewService.entityResource.reload());
	}

	edit(v: View) {
		this.dialogClosed<ViewListDialogComponent, View, View>(ViewListDialogComponent, v).subscribe(
			() => this.viewService.entityResource.reload(),
		);
	}

	delete(v: View) {
		this.viewService
			.readById(v.id ?? '')
			.pipe(
				switchMap((view) =>
					this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
						ConfirmDialogComponent,
						{
							message: view.name,
						},
					),
				),
			)
			.pipe(
				filter((res) => res),
				switchMap(() => this.viewService.delete(v.id)),
			)
			.subscribe({
				next: () => {
					this.viewService.entityResource.reload();
				},
				error: (err) => this.logger.error(err),
			});
	}
}

@Component({
	selector: 'orda-view-list-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		DialogTemplateComponent,
		MatLabel,
		MatFormFieldModule,
		MatInput,
		MatSelect,
		MatOption,
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
					<!--        <mat-form-field>-->
					<!--          <mat-label>Deposit</mat-label>-->
					<!--          <input matInput type="number" formControlName="deposit" />-->
					<!--        </mat-form-field>-->
					<mat-form-field>
						<mat-label>Roles</mat-label>
						<mat-select formControlName="roles" multiple [value]="viewDetails.value()">
							@for (role of roleService.entityResource.value(); track role.id) {
								<mat-option [value]="role.id">{{ role.name }}</mat-option>
							}
						</mat-select>
					</mat-form-field>
				</div>
			</form>
		</ng-template>
	`,
	styles: `
		form {
			display: flex;
			flex-direction: column;
		}
	`,
})
class ViewListDialogComponent extends DialogTemplateComponent<View> {
	viewService = inject(ViewService);
	roleService = inject(RoleService);

	viewDetails = rxResource({
		loader: () =>
			this.viewService.readById(this.inputData.id).pipe(map((view) => view.roles.map((r) => r.id))),
	});

	formGroup = new FormGroup({
		name: new FormControl('', [
			Validators.required,
			Validators.maxLength(25),
			Validators.minLength(3),
		]),
		desc: new FormControl('', [Validators.maxLength(40)]),
		roles: new FormControl([]),
		deposit: new FormControl(0, [Validators.required, Validators.min(0)]),
	});

	constructor() {
		super();

		this.formGroup.patchValue({
			name: this.inputData?.name,
			deposit: this.inputData?.deposit,
			desc: this.inputData?.desc,
		});
	}

	public submit = () => {
		if (this.inputData) {
			this.viewService
				.update(this.inputData?.id ?? '', {
					name: this.formGroup.value.name ?? '',
					desc: this.formGroup.value.desc ?? '',
				})
				.pipe(
					switchMap(() =>
						this.viewService.setRoles(this.inputData.id, this.formGroup.value.roles ?? []),
					),
				)
				.subscribe(this.closeObserver);
		} else {
			this.viewService
				.create({
					name: this.formGroup.value.name ?? '',
					// deposit: this.formGroup.value.deposit ?? 0,
					deposit: 100,
					desc: this.formGroup.value.desc ?? '',
				})
				.pipe(
					switchMap((view) => this.viewService.setRoles(view.id, this.formGroup.value.roles ?? [])),
				)
				.subscribe(this.closeObserver);
		}
	};

	// private equal = (a: string[], b: string[]) => {
	// 	if (a.length !== b.length) return false;
	// 	return JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort());
	// };
}
