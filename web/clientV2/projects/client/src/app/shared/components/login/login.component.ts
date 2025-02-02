import { Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'orda-login',
	imports: [ReactiveFormsModule],
	template: ` <form [formGroup]="loginForm" (ngSubmit)="authenticate()">
		<label for="first-name">Username: </label>
		<input id="first-name" type="text" formControlName="username" />
		<label for="last-name">Password: </label>
		<input id="last-name" type="text" formControlName="password" />
		<button type="submit" [disabled]="!loginForm.valid">Submit</button>
	</form>`,
	styles: ``,
})
export class LoginComponent {
	private authService = inject(AuthService);
	private router = inject(Router);

	protected loginForm = new FormGroup({
		username: new FormControl('', {
			updateOn: 'blur',
		}),
		password: new FormControl('', {
			updateOn: 'blur',
		}),
	});

	authenticate() {
		console.log(this.loginForm.value);

		if (!this.loginForm.valid) {
			console.log('invalid form');
			return;
		}

		if (this.loginForm.value.username !== '' && this.loginForm.value.password !== '') {
			this.authService
				.login(this.loginForm.value.username!, this.loginForm.value.password!)
				.subscribe({
					next: () => {
						console.log('login success');
						this.router.navigate(['/']).catch((err) => console.error(err));
					},
					error: (err) => {
						console.error(err);
					},
				});
		}
	}
}
