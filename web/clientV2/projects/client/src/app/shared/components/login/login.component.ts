import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'orda-login',
	imports: [
		ReactiveFormsModule,
		MatInputModule,
		MatButtonModule,
		MatFormFieldModule,
		MatCardModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
	],
	template: `
		<mat-card>
			<mat-card-content>
				<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
					<mat-form-field appearance="fill">
						<mat-label>Email</mat-label>
						<input
							name="username"
							autocomplete="username email"
							matInput
							formControlName="username"
							type="username"
							placeholder="Enter your username"
						/>
						@if (loginForm.get('username')?.hasError('required')) {
							<mat-error> Username is required</mat-error>
						}
					</mat-form-field>

					<mat-form-field appearance="fill">
						<mat-label>Password</mat-label>
						<input hidden type="text" name="username" value="..." autocomplete="username email" />
						<input
							name="password"
							autocomplete="current-password"
							matInput
							formControlName="password"
							type="password"
							placeholder="Enter your password"
						/>
						@if (loginForm.get('password')?.hasError('required')) {
							<mat-error>Password is required</mat-error>
						}
					</mat-form-field>
					<mat-checkbox formControlName="saveLogin">Save Login?</mat-checkbox>
					@if (errorMsg() !== '') {
						<mat-error>{{ errorMsg() }}</mat-error>
					}
					<div class="container">
						@if (!isLoading) {
							<button mat-button color="primary" [disabled]="loginForm.invalid" type="submit">
								Login
							</button>
						} @else {
							<mat-spinner diameter="30" />
						}
					</div>
				</form>
			</mat-card-content>
		</mat-card>
	`,
	styles: `
		.container {
			display: flex;
			justify-content: center;
		}

		section {
			margin: 12px 0;
		}

		mat-card {
			width: 400px;
			padding: 1rem;
			margin: 4rem auto auto;
		}

		mat-form-field {
			width: 100%;
		}

		button {
			width: 100%;
			margin-top: 20px;
			border: 1px solid;
		}
	`,
})
export class LoginComponent {
	private authService = inject(AuthService);
	private router = inject(Router);

	protected isLoading = false;

	errorMsg = signal('');

	protected loginForm = new FormGroup({
		username: new FormControl('admin', [
			Validators.required,
			Validators.pattern('^[a-zA-Z0-9_-]+$'),
		]),
		password: new FormControl('8m37G361M3Kugol2ZSH0117JODANt8', [Validators.required]),
		saveLogin: new FormControl({ value: true, disabled: true }, {}),
	});

	onSubmit() {
		this.isLoading = true;
		this.errorMsg.set('');

		if (!this.loginForm.valid) {
			return;
		}

		if (this.loginForm.value.username !== '' && this.loginForm.value.password !== '') {
			this.authService
				.login(this.loginForm.value.username!, this.loginForm.value.password!)
				.subscribe({
					next: () => {
						this.isLoading = false;
						this.router.navigate(['/home']).catch((err) => console.error(err));
					},
					error: (err) => {
						this.isLoading = false;
						this.errorMsg.set('Login failed. Please check your username and password.');
						console.error(err);
					},
				});
		}
	}
}
