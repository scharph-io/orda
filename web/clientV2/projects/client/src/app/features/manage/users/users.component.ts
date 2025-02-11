import { ChangeDetectionStrategy, Component, inject, InjectionToken } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { User } from '@core/models/user';
import { DialogTemplateComponent } from '@shared/components/dialog/dialog-template.component';
import { EntityManager } from '@shared/utils/entity-manager';
import { UserService } from '@features/data-access/services/user.service';
import { switchMap } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog.component';

export const FORM = new InjectionToken<FormGroup>('form');

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
	styleUrl: './users.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends EntityManager<User> {
	userService = inject(UserService);
	create(): void {
		this.dialogAfterClosed<UserDialogComponent, undefined, User>(UserDialogComponent, undefined)
			.pipe(
				switchMap((res) => {
					return this.userService.create(res);
				}),
			)
			.subscribe(this.fnObserver(() => this.userService.resource.reload()));
	}

	delete(u: User): void {
		this.dialogAfterClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(
			ConfirmDialogComponent,
			{
				message: u.username,
			},
		)
			.pipe(switchMap(() => this.userService.delete(u.id ?? '')))
			.subscribe(this.fnObserver(() => this.userService.resource.reload()));
	}
	edit(u: User): void {
		this.dialogAfterClosed<UserDialogComponent, User, User>(UserDialogComponent, u)
			.pipe(switchMap((res) => this.userService.update(u.id ?? '', res)))
			.subscribe(this.fnObserver(() => this.userService.resource.reload()));
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
					<input matInput formControlName="role" />
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
	],
	providers: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogComponent extends DialogTemplateComponent<User> {
	formGroup = new FormGroup({
		name: new FormControl<string>(''),
		role: new FormControl<string>(''),
	});

	constructor() {
		super();
		this.formGroup.patchValue({
			name: this.data?.username,
			role: this.data?.role,
		});
	}

	public submit = () => {
		if (this.formGroup.dirty) {
			this.dialogRef.close({
				username: this.formGroup.value.name ?? '',
				role: this.formGroup.value.role ?? '',
				password: 'test123',
			});
		}
	};
}
