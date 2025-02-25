import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountGroup } from '@orda.core/models/account';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';
import { AccountService } from '@orda.features/data-access/services/account/account.service';
import { AccountGroupService } from '@orda.features/data-access/services/account/account-group.service';

import { MatExpansionModule } from '@angular/material/expansion';
import { OrdaLogger } from '@orda.shared/services/logger.service';

@Component({
	selector: 'orda-account',
	imports: [MatButtonModule, MatExpansionModule],
	template: `
		<button mat-button (click)="create()">Create</button>
		<mat-accordion>
			@for (group of accountGroupService.entityResource.value(); track group.id) {
				<mat-expansion-panel hideToggle>
					<mat-expansion-panel-header>
						<mat-panel-title> {{ group.name }}</mat-panel-title>
					</mat-expansion-panel-header>
					<ng-template matExpansionPanelContent>
						<button mat-button (click)="edit(group)">Update</button>
						<button mat-button (click)="delete(group)">Delete</button>
					</ng-template>
				</mat-expansion-panel>
			}
		</mat-accordion>
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends EntityManager<AccountGroup> {
	logger = inject(OrdaLogger);
	accountService = inject(AccountService);
	accountGroupService = inject(AccountGroupService);

	readonly panelOpenState = signal(false);

	constructor() {
		super();
		this.accountGroupService.entityResource.reload();
	}

	create() {
		this.dialogClosed<AccountGroupDialogComponent, undefined, AccountGroup>(
			AccountGroupDialogComponent,
			undefined,
		).subscribe(() => this.accountGroupService.entityResource.reload());
	}

	edit(group: AccountGroup) {
		this.dialogClosed<AccountGroupDialogComponent, AccountGroup, AccountGroup>(
			AccountGroupDialogComponent,
			group,
		).subscribe(() => this.accountGroupService.entityResource.reload());
	}

	delete(group: AccountGroup) {
		this.accountGroupService
			.readById(group.id ?? '')
			.pipe(
				switchMap((group) =>
					this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
						ConfirmDialogComponent,
						{
							message: `Are you sure you want to delete the group '${group.name}'?`,
						},
					),
				),
			)
			.pipe(
				filter((res) => res),
				switchMap(() => this.accountGroupService.delete(group.id)),
			)
			.subscribe({
				next: () => {
					this.accountGroupService.entityResource.reload();
				},
				error: (err) => this.logger.error(err),
			});
	}
}

@Component({
	selector: 'orda-account-group-dialog',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		DialogTemplateComponent,
		MatLabel,
		MatFormFieldModule,
		MatInput,
	],
	template: `
		<orda-dialog-template
			[customTemplate]="template"
			[form]="formGroup"
			(submitClick)="submit()"
		></orda-dialog-template>
		<ng-template #template>
			<form [formGroup]="formGroup">
				<mat-form-field>
					<mat-label>Name</mat-label>
					<input matInput formControlName="name" />
				</mat-form-field>
			</form>
		</ng-template>
	`,
	styles: ``,
})
class AccountGroupDialogComponent extends DialogTemplateComponent<AccountGroup> {
	accountGroupService = inject(AccountGroupService);

	formGroup = new FormGroup({
		name: new FormControl('', [
			Validators.required,
			Validators.maxLength(10),
			Validators.minLength(3),
		]),
	});

	constructor() {
		super();
		this.formGroup.patchValue({
			name: this.inputData?.name,
		});
	}

	public submit = () => {
		if (this.inputData) {
			this.accountGroupService
				.update(this.inputData?.id ?? '', {
					name: this.formGroup.value.name ?? '',
				})
				.subscribe(this.closeObserver);
		} else {
			this.accountGroupService
				.create({
					name: this.formGroup.value.name ?? '',
				})
				.subscribe(this.closeObserver);
		}
	};
}
