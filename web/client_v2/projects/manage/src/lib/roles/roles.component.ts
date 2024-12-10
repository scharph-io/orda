import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { PermissionsTableComponent } from './permissions-table/permissions-table.component';
import { RoleService } from '../services/role.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface Role {
  id: number;
  name: string;
}

@Component({
  selector: 'lib-roles',
  imports: [
    MatExpansionModule,
    PermissionsTableComponent,
    TitleCasePipe,
    MatButtonModule,
  ],
  template: `
    <h2>Roles</h2>
    <p>Be careful what you do</p>
    @for(role of roles(); track role.id){
    <mat-accordion class="role">
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> {{ role.name | titlecase }} </mat-panel-title>
        </mat-expansion-panel-header>

        <ng-template matExpansionPanelContent>
          <h4>Manage</h4>
          <button mat-button>Delete</button>
          <orda-permissions-table [role]="role.name" />
        </ng-template>
      </mat-expansion-panel>
    </mat-accordion>
    }
  `,
  styleUrl: './roles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
  roleService = inject(RoleService);
  roles = toSignal(this.roleService.getRoles(), { initialValue: [] });
  constructor() {
    console.log('RolesComponent created');
  }
}
