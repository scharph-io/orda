import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../auth/data.service';
import { OrderViewComponent } from '../orderview/orderview.component';

@Component({
  selector: 'orda-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    OrderViewComponent,
  ],
  providers: [DataService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  restrictedInfo?: string;
  constructor(private authservice: AuthService) {}

  get isAdmin() {
    return this.authservice.isAdmin();
  }

  get isExpired() {
    return this.authservice.isExpired();
  }
}
