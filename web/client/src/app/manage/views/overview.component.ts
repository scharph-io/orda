import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { View } from '../../shared/model/view';
import { CreateViewDialogComponent } from './create-view-dialog.component';
import { ViewService } from '../../shared/services/view.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
// import { CreateProductDialogComponent } from '../products/create-product-dialog.component';

@Component({
    selector: 'orda-details-overview',
    template: `
    <div class="toolbar">
      <h2>views</h2>
      <div>
        <button mat-fab extended (click)="openViewAddUpdateDialog()">
          <mat-icon>add</mat-icon>
          new_view
        </button>
        <button
          mat-icon-button
          [matMenuTriggerFor]="menu"
          aria-label="Example icon-button with a menu"
        >
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item disabled>
            <mat-icon>download</mat-icon>
            <span>Import TODO</span>
          </button>
          <button mat-menu-item disabled>
            <mat-icon>upload</mat-icon>
            <span>Export TODO</span>
          </button>
        </mat-menu>
      </div>
    </div>
    @if (views().length === 0) {
      <div class="container">No views found</div>
    } @else {
      <mat-grid-list cols="5" rowHeight="4:3" gutterSize="1em">
        @for (view of views(); track view) {
          <mat-grid-tile [routerLink]="['/views', view.id]">{{
            view.name
          }}</mat-grid-tile>
        }
      </mat-grid-list>
    }
  `,
    styles: [
        `
      mat-grid-tile {
        background: grey;
        border: 1px solid red;
      }
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 1em;
      }
    `,
    ],
    imports: [
        MatIconModule,
        MatButtonModule,
        DialogModule,
        MatGridListModule,
        RouterModule,
        MatMenuModule,
    ]
})
export class ViewsOverviewComponent implements OnInit {
  dialog = inject(MatDialog);
  http = inject(HttpClient);
  viewService = inject(ViewService);

  views = signal<View[]>([]);

  ngOnInit(): void {
    this.viewService.getViews$().subscribe((views) => {
      this.views.set(views);
    });
  }

  openViewAddUpdateDialog(): void {
    const dialogRef = this.dialog.open(CreateViewDialogComponent, {
      // data: { views: this.views() },
      minWidth: '30rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result.data);

      if (!result) {
        return;
      }

      if (result?.action === 'add') {
        this.viewService.addView$(result.data as View).subscribe((res) => {
          this.ngOnInit();
        });
      }

      // if (result?.action === 'update') {
      //   this.viewService
      //     .updateView$(result.data.id, result.data)
      //     .subscribe((res) => {
      //       console.log('updateView', res);
      //       this.views.set(
      //         this.views().map((view) =>
      //           view.id === result.data.id ? res : view,
      //         ),
      //       );
      //     });
      // }
    });
  }
}
