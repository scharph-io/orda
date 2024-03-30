import { Component, OnInit, inject, isDevMode } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, Claims } from '../auth/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'orda-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    JsonPipe,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  error = '';

  constructor(private authService: AuthService) {}

  credentials = new FormGroup({
    username: new FormControl('admin', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl(isDevMode() ? 'secret' : '', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  getErrorMessage() {
    if (this.credentials.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  canLogin() {
    return this.credentials.valid;
  }

  login() {
    if (
      this.credentials.controls.username.value &&
      this.credentials.controls.password.value
    ) {
      this.authService
        .auth(
          this.credentials.controls.username.value,
          this.credentials.controls.password.value,
        )
        .subscribe({
          next: (res: { token: string }) => {
            this.authService.setToken(res.token);
            this.authService.forwardToHome();
          },
          error: (err) => {
            this.error = err.message;
          },
        });
    }
  }

  logout() {
    this.authService.logout();
  }
}
