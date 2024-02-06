import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
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
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;

  constructor(private authService: AuthService) {}

  credentials = new FormGroup({
    username: new FormControl('admin', [Validators.required]),
    password: new FormControl('secret', [Validators.required]),
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
    console.log(this.credentials.value);
    if (
      this.credentials.controls.username.value &&
      this.credentials.controls.password.value
    ) {
      this.authService.auth(
        this.credentials.controls.username.value,
        this.credentials.controls.password.value,
      );
    }

    // console.log(username, password);
  }

  logout() {
    this.authService.logout();
  }
}
