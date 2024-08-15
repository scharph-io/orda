import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject, OnChanges, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GroupsOverviewComponent } from './group/groups-overview.component';
import { MatDialog } from '@angular/material/dialog';
// import { CreateProductDialogComponent } from '../products/create-product-dialog.component';
import { CreateGroupDialogComponent } from './group/create-group-dialog.component';
import { AssortmentService } from '../../shared/services/assortment.service';
import { Group } from '../../shared/model/product';

@Component({
  selector: 'orda-assortment-overview',
  template: `
    <div class="toolbar">
      <h2>assortment</h2>
      <button mat-fab extended (click)="openGroupAddUpdateDialog()">
        <mat-icon>add</mat-icon>
        new_group
      </button>
    </div>
    <orda-groups-overview [groups]="groups()" />
  `,
  standalone: true,
  styles: [
    `
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 1em;
      }
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    DialogModule,
    GroupsOverviewComponent,
    CreateGroupDialogComponent,
  ],
})
export class AssortmentOverviewComponent implements OnInit {
  assortmentService = inject(AssortmentService);
  dialog = inject(MatDialog);

  groups = signal<Group[]>([]);

  ngOnInit(): void {
    this.assortmentService.getGroups$().subscribe((g) => {
      this.groups.set(g);
    });
  }

  openGroupAddUpdateDialog(): void {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      //   data: { product, categoryId: this.category().id },
      minWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);

      this.ngOnInit();
    });
  }
}
