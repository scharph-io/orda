import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
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
      <h2>view details</h2>
      <button mat-fab extended (click)="openViewAddUpdateDialog()">
        <mat-icon>add</mat-icon>
        add
      </button>
    </div>

    <div>
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
    </div>
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
  ],
})
export class ViewDetailsComponent {
  dialog = inject(MatDialog);

  id = 13;

  groups: ViewGroup[] = [
    {
      id: '1',
      name: 'Getränke',
      position: 1,
      products: [
        {
          id: '0',
          name: 'Bier 0',
          price: 400,
          active: true,
          groupId: '1',
          position: 1,
          desc: '0.5L',
        },
        {
          id: '1',
          name: 'Bier 1',
          price: 500,
          active: true,
          groupId: '1',
          position: 2,
          desc: '0.3L',
        },
        {
          id: '2',
          name: 'Bier 2',
          price: 2000,
          active: true,
          groupId: '1',
          position: 3,
          desc: '2L',
          color: 'blue',
        },
        {
          id: '3',
          name: 'Bier 3',
          price: 500,
          active: true,
          groupId: '1',
          position: 2,
          desc: '0.3L',
        },
        {
          id: '4',
          name: 'Bier 4',
          price: 2000,
          active: true,
          groupId: '1',
          position: 3,
          desc: '2L',
        },
        {
          id: '5',
          name: 'Bier 5',
          price: 500,
          active: true,
          groupId: '1',
          position: 2,
          desc: '0.3L',
        },
        {
          id: '6',
          name: 'Bier 6',
          price: 2000,
          active: true,
          groupId: '1',
          position: 3,
          desc: '2L',
        },
        {
          id: '7',
          name: 'Bier 7',
          price: 2000,
          active: true,
          groupId: '1',
          position: 3,
          desc: '2L',
        },
        {
          id: '8',
          name: 'Bier 8',
          price: 500,
          active: true,
          groupId: '1',
          position: 2,
          desc: '0.3L',
        },
        {
          id: '9',
          name: 'Bier 9',
          price: 2000,
          active: true,
          groupId: '1',
          position: 3,
          desc: '2L',
        },
      ],
    },
    {
      id: '2',
      name: 'Speisen',
      position: 2,
      products: [
        {
          name: 'Leberkäs Semmel',
          price: 200,
          active: true,
          groupId: '2',
          position: 1,
          desc: 'desc',
        },
        {
          name: 'Kotelett',
          price: 790,
          active: true,
          groupId: '2',
          position: 2,
          desc: 'mit Pommes und Ketchup',
        },
      ],
    },
    {
      id: '3',
      name: 'Tabak',
      position: 5,
      products: [
        {
          name: 'Zigaretten',
          desc: 'Alle Sorten',
          price: 700,
          active: true,
          groupId: '1',
          position: 1,
        },
      ],
    },
  ];

  msg(msg: string) {
    console.log(msg);
  }

  openViewAddUpdateDialog(): void {
    // const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
    //   //   data: { product, categoryId: this.category().id },
    //   minWidth: '30rem',
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    //   //   this.productService
    //   //     .getProductsBy(this.category().id ?? '')
    //   //     .subscribe((products) => {
    //   //       this.dataSource?.set(products);
    //   //     });
    // });
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
