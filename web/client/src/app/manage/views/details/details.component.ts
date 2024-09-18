import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ViewProduct } from '../../../shared/model/product';
import { MatDividerModule } from '@angular/material/divider';
// import { CreateProductDialogComponent } from '../products/create-product-dialog.component';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ViewProductComponent } from './view-product/view-product.component';
import { MatMenuModule } from '@angular/material/menu';
import { CreateViewDialogComponent } from '../create-view-dialog.component';
import { switchMap, tap } from 'rxjs';
import { ViewService } from '../../../shared/services/view.service';
import { group } from '@angular/animations';
import { View } from '../../../shared/model/view';
import { TranslocoModule } from '@jsverse/transloco';
import { ProductAppendDialogComponent } from './product-append-dialog.component';
import { JsonPipe } from '@angular/common';

export interface ViewGroup {
  id?: string;
  name: string;
  desc?: string;
  position: number;
  products: ViewProduct[];
}

@Component({
  selector: 'orda-view-details',
  template: `
    <div class="toolbar">
      <h2>{{ view().name }}</h2>
      <div>
        <button
          style="background-color: #E6E050;"
          mat-icon-button
          (click)="openProductAppendDialog()"
        >
          <mat-icon>add</mat-icon>
        </button>
        <button
          mat-icon-button
          [matMenuTriggerFor]="menu"
          aria-label="Example icon-button with a menu"
        >
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="openUpdateDialog()">
            <mat-icon>edit</mat-icon>
            <span>Edit</span>
          </button>
          <button mat-menu-item (click)="delete()">
            <mat-icon>delete</mat-icon>
            <span>Delete</span>
          </button>
        </mat-menu>
      </div>
    </div>

    {{ view() | json }}

    <!-- <div>
      @for (g of groups; track g) {
        <h4>{{ g.name }}</h4>
        <div>
          <div
            cdkDropList
            class="example-list"
            (cdkDropListDropped)="drop(g.products, $event)"
          >
            @for (p of g.products; track p) {
              <div
                class="example-box"
                cdkDrag
                [cdkDragStartDelay]="250"
                (cdkDragDropped)="msg('dropped')"
                (cdkDragEnded)="msg('ended')"
              >
                <div
                  class="example-custom-placeholder"
                  *cdkDragPlaceholder
                ></div>
                <orda-view-product [product]="p" />
              </div>
            }
          </div>
        </div>
      }
    </div> -->
  `,
  standalone: true,
  styles: [
    `
      :host {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
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

      .example-list {
        width: 500px;
        max-width: 100%;
        border: solid 1px #ccc;
        min-height: 40px;
        display: block;
        // background: white;
        border-radius: 4px;
        overflow: hidden;
      }

      .example-box {
        padding: 20px 10px;
        border-bottom: solid 1px #ccc;
        color: rgba(0, 0, 0, 0.87);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        cursor: move;
        // background: white;
        font-size: 14px;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow:
          0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14),
          0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .example-box:last-child {
        border: none;
      }

      .example-list.cdk-drop-list-dragging
        .example-box:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .example-custom-placeholder {
        background: #ccc;
        border: dotted 3px #999;
        min-height: 60px;
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    DialogModule,
    MatGridListModule,
    MatListModule,
    MatDividerModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    ViewProductComponent,
    MatMenuModule,
    TranslocoModule,
    JsonPipe,
  ],
})
export class ViewDetailsComponent implements OnInit {
  dialog = inject(MatDialog);

  viewService = inject(ViewService);

  route = inject(ActivatedRoute);
  router = inject(Router);

  view = signal<View>({ id: '' });

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap((params) => this.viewService.getView$(params['id'])))
      .subscribe((v) => {
        this.view.set(v);
      });
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open<CreateViewDialogComponent, View, any>(
      CreateViewDialogComponent,
      {
        data: this.view(),
        minWidth: '30rem',
      },
    );
    dialogRef.beforeClosed().subscribe((res) => {
      console.log('The dialog was started closed', res.data);
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result.data);

      if (!result) {
        return;
      }

      this.viewService
        .updateView$(this.view().id, result.data as View)
        .subscribe((res) => {
          this.view.set(res);
        });
    });
  }

  delete(): void {
    this.viewService.deleteView$(this.view().id).subscribe((res) => {
      console.log('deleteView', res);
      this.router.navigate(['/views']);
    });
  }

  openProductAppendDialog() {
    const dialogRef = this.dialog.open(ProductAppendDialogComponent, {
      data: this.view(),
      minWidth: '40rem',
    });
    dialogRef.beforeClosed().subscribe((res) => {
      console.log('The dialog was closed', res);
    });
    // dialogRef.afterClosed().subscribe((result) => {});
  }

  //   drop(groupId: string, event: CdkDragDrop<ViewProduct>) {
  //     moveItemInArray(
  //       this.groups.find((g) => g.id === groupId)?.products ?? [],
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }

  drop(p: ViewProduct[], event: CdkDragDrop<ViewProduct[]>) {
    moveItemInArray(p, event.previousIndex, event.currentIndex);
  }
}
