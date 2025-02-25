import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { OrdaLogger } from '@orda.shared/services/logger.service';
import { filter, switchMap } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { AccountGroupService } from '@orda.features/data-access/services/account/account-group.service';
import { AccountGroup } from '@orda.core/models/account';

@Component({
	selector: 'orda-account-group',
	imports: [MatButtonModule, MatListModule, MatIcon, TitleCasePipe],
	template: `
		<div class="title-toolbar">
			<h2>Account Groups</h2>
			<button mat-button (click)="create()">New</button>
		</div>

		<mat-list role="list">
			@for (group of accountGroupService.entityResource.value(); track group.id) {
				<mat-list-item role="listitem">
					<div class="item">
						<p>{{ group.name | titlecase }}</p>
						<div>
							<button title="delete group" class="red-btn" mat-icon-button (click)="delete(group)">
								<mat-icon>delete</mat-icon>
							</button>
							<button title="edit group" mat-icon-button (click)="edit(group)">
								<mat-icon>edit</mat-icon>
							</button>
						</div>
					</div>
				</mat-list-item>
			}
		</mat-list>
	`,
	styles: `
		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.title-toolbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountGroupComponent extends EntityManager<AccountGroup> {
	accountGroupService = inject(AccountGroupService);
	logger = inject(OrdaLogger);

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
