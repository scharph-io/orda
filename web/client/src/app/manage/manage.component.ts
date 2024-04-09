import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { PagesManageComponent } from './pages/pages.component';
import { UsersManageComponent } from './users/users.component';
import { ProductsManageComponent } from './products/products.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'orda-manage',
  standalone: true,
  template: `
    <mat-tab-group>
      <mat-tab [label]="'manage.products' | transloco"
        ><orda-products-manage
      /></mat-tab>
      <mat-tab [label]="'manage.pages' | transloco"
        ><orda-pages-manage
      /></mat-tab>
      <mat-tab [label]="'manage.users' | transloco">
        <orda-users-manage />
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [``],
  imports: [
    TranslocoModule,
    MatTabsModule,
    PagesManageComponent,
    UsersManageComponent,
    ProductsManageComponent,
  ],
})
export class ManageComponent {
  auth = inject(AuthService);
}
