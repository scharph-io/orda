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
import { User } from '@orda.core/models/user';
import { DialogTemplateComponent } from '@orda.shared/components/dialog/dialog-template.component';
import { EntityManager } from '@orda.shared/utils/entity-manager';
import { UserService } from '@orda.features/data-access/services/user.service';
import { RoleService } from '@orda.features/data-access/services/role.service';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';
import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from '@orda.shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { RolesComponent } from '../roles/roles.component';
import { StrongPasswordRegx } from '@orda.core/constants';

@Component({
	selector: 'orda-users',
	imports: [MatButtonModule, MatTabsModule, RolesComponent],
	template: `
		<mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms">
			<mat-tab label="Users">
				<ng-template matTabContent>
					<div style="height: 80vh; overflow: auto;">
						<button mat-button (click)="create()">New</button>
						<br />
						@for (user of userService.entityResource.value(); track user.id) {
							{{ user.username }} ({{ user.role }})
							<button mat-button (click)="edit(user)">Edit</button>
							<button mat-flat-button class="delete-btn" (click)="delete(user)">Delete</button>
							<br />
						}
					</div>
				</ng-template>
			</mat-tab>
			<mat-tab label="Roles">
				<ng-template matTabContent>
					<orda-roles />
				</ng-template>
			</mat-tab>
		</mat-tab-group>
	`,
	styles: `
		mat-tab-group {
			overflow: auto;
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends EntityManager<User> {
	userService = inject(UserService);

	constructor() {
		super();
		this.userService.entityResource.reload();
	}

	create(): void {
		this.dialogClosed<UserDialogComponent, undefined, User>(
			UserDialogComponent,
			undefined,
		).subscribe(() => this.userService.entityResource.reload());
	}

	edit(u: User): void {
		this.dialogClosed<UserDialogComponent, User, User>(UserDialogComponent, u).subscribe(() =>
			this.userService.entityResource.reload(),
		);
	}

	delete(u: User): void {
		this.dialogClosed<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
			message: u.username,
		})
			.pipe(switchMap(() => this.userService.delete(u.id ?? '')))
			.subscribe(() => this.userService.entityResource.reload());
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
        <div class="dialog-flex">
          <mat-form-field>
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Password</mat-label>
            <input type="password" matInput formControlName="password" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              @for (role of roleService.entityResource.value(); track role.id) {
                <mat-option [value]="role.id">{{ role.name | titlecase }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
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
		password: new FormControl<string>('', [
			Validators.required,
			Validators.minLength(3),
			Validators.maxLength(25),
			Validators.pattern(StrongPasswordRegx),
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

	public validPassword = (pw1: string, pw2: string): boolean => pw1 === pw2;
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
					password: this.formGroup.value.password ?? '',
				})
				.subscribe(this.closeObserver);
		}
	};
}
