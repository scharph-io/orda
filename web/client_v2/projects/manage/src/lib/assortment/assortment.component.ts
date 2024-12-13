import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-assortment',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './assortment.component.html',
  styleUrl: './assortment.component.css',
})
export class AssortmentComponent {}
