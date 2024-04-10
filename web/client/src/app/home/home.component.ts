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
  constructor(private authservice: AuthService) {

  }

  get isAdmin() {
    return this.authservice.isAdmin();
  }

  get isExpired() {
    return this.authservice.isExpired();
  }

  getProductGroups() {
    return [
      {
        id: 1,
        name: 'Beverages',
        products: [
          {
            name: 'Coffee',
            price: 2.5,
          },
          {
            name: 'Tea',
            price: 2.0,
          },
          {
            name: 'Coke',
            price: 2.0,
          },
          {
            name: 'Fanta',
            price: 2.0,
          },
          {
            name: 'Sprite',
            price: 2.0,
          },
        ],
      },
      {
        id: 2,
        name: 'Food',
        products: [
          {
            name: 'Pizza',
            price: 5.0,
          },
          {
            name: 'Pasta',
            price: 3.0,
          },
          {
            name: 'Burger',
            price: 4.0,
          },
          {
            name: 'Fries',
            price: 2.5,
          },
        ],
      },
      {
        id: 3,
        name: 'Desserts',
        products: [
          {
            name: 'Ice Cream',
            price: 2.5,
          },
          {
            name: 'Cake',
            price: 3.5,
          },
        ],
      },
    ];
  }
}
