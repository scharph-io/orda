import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import {
  Permission,
  PermissionService,
} from '../../services/permission.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'orda-permissions-table',
  imports: [MatTableModule, FormsModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './permissions-table.component.html',
  styleUrl: './permissions-table.component.scss',
})
export class PermissionsTableComponent {
  role = input.required<string>();

  mainDisplayedColumns: string[] = [
    'module',
    'create',
    'read',
    'update',
    'delete',
  ];
  viewDisplayedColumns: string[] = ['view', 'read'];

  permService = inject(PermissionService);

  mainPermissions = [
    { module: 'Roles', create: true, read: true, update: true, delete: true },
    {
      module: 'Assortment',
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  ];

  viewPermissions = [
    {
      view: 'A',
      read: false,
    },
    {
      view: 'B',
      read: true,
    },
  ];

  constructor() {
    console.log('role', this.role);
    // this.permService.getPermissions().subscribe((permissions) => {
    //   this.dataSource = permissions;
    // });
  }

  onPermissionChange(permission: Permission) {
    this.permService.updatePermission(permission);
  }

  isAdmin() {
    return this.role() === 'admin';
  }
}
