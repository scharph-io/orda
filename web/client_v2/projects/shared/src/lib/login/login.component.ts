import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `<div class="login-container">
    <mat-card class="login-card" appearance="outlined">
      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- Email Input -->
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input
              matInput
              formControlName="email"
              type="email"
              placeholder="Enter your email"
            />

            @if (email.invalid && (email.dirty || email.touched)) {
            <mat-error>
              @switch (true) { @case (email.errors?.['required']) { Email is
              required } @case (email.errors?.['email']) { Please enter a valid
              email } }
            </mat-error>
            }
          </mat-form-field>

          <!-- Password Input -->
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input
              matInput
              [type]="passwordVisibility()"
              formControlName="password"
              placeholder="Enter your password"
            />

            <button
              mat-icon-button
              matSuffix
              (click)="togglePasswordVisibility()"
              type="button"
            >
              <mat-icon>
                @if (isPasswordHidden()) { visibility_off } @else { visibility }
              </mat-icon>
            </button>

            @if (password.invalid && (password.dirty || password.touched)) {
            <mat-error>
              @switch (true) { @case (password.errors?.['required']) { Password
              is required } @case (password.errors?.['minlength']) { Password
              must be at least 8 characters } }
            </mat-error>
            }
          </mat-form-field>

          <!-- Login Button -->
          <div class="login-actions">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="loginForm.invalid || isLoading()"
            >
              @if (isLoading()) {
              <mat-spinner diameter="20"></mat-spinner>
              } @else { Login }
            </button>
          </div>

          @if (loginError()) {
          <div class="error-message">
            {{ loginError() }}
          </div>
          }
        </form>
      </mat-card-content>
    </mat-card>
  </div>`,

  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  isPasswordHidden = signal(true);
  isLoading = signal(false);
  loginError = signal<string | null>(null);

  // Reactive form declaration
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  // Computed signal for password visibility
  passwordVisibility() {
    return this.isPasswordHidden() ? 'password' : 'text';
  }

  // Toggle password visibility method
  togglePasswordVisibility(): void {
    this.isPasswordHidden.set(!this.isPasswordHidden());
  }

  // Form submission method
  onSubmit(): void {
    // Reset previous error
    this.loginError.set(null);

    if (this.loginForm.valid) {
      // Simulate login process
      this.isLoading.set(true);

      // Simulated async login
      setTimeout(() => {
        try {
          // Mock login logic
          const { email, password } = this.loginForm.value;

          // Simulate authentication
          if (email === 'test@example.com' && password === 'password123') {
            this.snackBar.open('Login Successful!', 'Close', {
              duration: 3000,
            });
          } else {
            this.loginError.set('Invalid email or password');
          }
        } catch (error) {
          this.loginError.set('An unexpected error occurred');
        } finally {
          this.isLoading.set(false);
        }
      }, 1500);
    }
  }

  // Convenience getters for form controls
  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }
}
