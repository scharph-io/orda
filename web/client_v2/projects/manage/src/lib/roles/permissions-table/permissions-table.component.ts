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

  displayedColumns: string[] = ['module', 'create', 'read', 'update', 'delete'];
  permService = inject(PermissionService);

  permissions = [
    { module: 'Users', create: true, read: true, update: true, delete: true },
    { module: 'Roles', create: true, read: true, update: true, delete: true },
    {
      module: 'Projects',
      create: true,
      read: true,
      update: true,
      delete: true,
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
