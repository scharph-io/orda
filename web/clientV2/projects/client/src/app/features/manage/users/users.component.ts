import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { User } from '@core/models/user';
import { DialogTemplateComponent } from '@shared/components/dialog/dialog-template.component';
import { EntityManager } from '@shared/utils/entity-manager';
import { UserService } from '@features/data-access/services/user.service';
import { RoleService } from '@features/data-access/services/role.service';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs';

@Component({
	selector: 'orda-users',
	imports: [MatButtonModule],
	template: `
		<div class="title-toolbar">
			<h2>Users</h2>
			<button mat-button (click)="create()">New</button>
			<br />
			@for (user of userService.resource.value(); track user.id) {
				{{ user.username }} ({{ user.role }})
				<button mat-button (click)="edit(user)">Edit</button>
				<button mat-button (click)="delete(user)">Delete</button>
				<br />
			}
		</div>
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends EntityManager<User> {
	userService = inject(UserService);

	constructor() {
		super();
		this.userService.resource.reload();
	}

	create(): void {
		this.dialogClosed<UserDialogComponent, undefined, User>(
			UserDialogComponent,
			undefined,
		).subscribe(() => this.userService.resource.reload());
	}

	edit(u: User): void {
		this.dialogClosed<UserDialogComponent, User, User>(UserDialogComponent, u).subscribe(() =>
			this.userService.resource.reload(),
		);
	}

	delete(u: User): void {
		this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
			message: u.username,
		})
			.pipe(switchMap(() => this.userService.delete(u.id ?? '')))
			.subscribe(() => this.userService.resource.reload());
	}
}

@Component({
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
				<mat-form-field>
					<mat-label>Role</mat-label>
					<mat-select formControlName="role">
						@for (role of roleService.resource.value(); track role.id) {
							<mat-option [value]="role.id">{{ role.name | titlecase }}</mat-option>
						}
					</mat-select>
				</mat-form-field>
			</form>
		</ng-template>
	`,
	imports: [
		DialogTemplateComponent,
		MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
		MatLabel,
		MatFormField,
		MatInput,
		MatSelectModule,
		TitleCasePipe,
	],
	providers: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class UserDialogComponent extends DialogTemplateComponent<User> {
	roleService = inject(RoleService);
	userService = inject(UserService);

	formGroup = new FormGroup({
		name: new FormControl<string>('', [
			Validators.required,
			Validators.minLength(3),
			Validators.maxLength(15),
		]),
		role: new FormControl<string>('', Validators.required),
	});

	constructor() {
		super();
		this.formGroup.patchValue({
			name: this.inputData?.username,
			role: this.inputData?.roleid,
		});
	}

	public submit = () => {
		if (this.inputData) {
			this.userService
				.update(this.inputData.id ?? '', {
					username: this.formGroup.value.name ?? '',
					roleid: this.formGroup.value.role ?? '',
				})
				.subscribe(this.closeObserver);
		} else {
			this.userService
				.create({
					username: this.formGroup.value.name ?? '',
					roleid: this.formGroup.value.role ?? '',
					password: 'test123',
				})
				.subscribe(this.closeObserver);
		}
	};
}
