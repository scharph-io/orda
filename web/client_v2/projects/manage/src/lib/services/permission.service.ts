import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Permission {
  id: number;
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<Permission[]>([
    {
      id: 1,
      module: 'Users',
      create: true,
      read: true,
      update: false,
      delete: false,
    },
    {
      id: 2,
      module: 'Roles',
      create: false,
      read: true,
      update: true,
      delete: false,
    },
    {
      id: 3,
      module: 'Reports',
      create: false,
      read: true,
      update: false,
      delete: false,
    },
  ]);

  getPermissions(): Observable<Permission[]> {
    return this.permissionsSubject.asObservable();
  }

  updatePermission(updatedPermission: Permission) {
    const currentPermissions = this.permissionsSubject.value;
    const index = currentPermissions.findIndex(
      (p) => p.id === updatedPermission.id
    );

    if (index !== -1) {
      const newPermissions = [...currentPermissions];
      newPermissions[index] = updatedPermission;
      this.permissionsSubject.next(newPermissions);
    }
  }
}
