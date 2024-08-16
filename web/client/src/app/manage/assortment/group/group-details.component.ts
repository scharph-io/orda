import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';

import { MatListModule } from '@angular/material/list';
import { ProductsOverviewComponent } from '../product/products-overview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AssortmentService } from '../../../shared/services/assortment.service';
import { Group } from '../../../shared/model/product';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';
import {
  ActionType,
  CreateGroupDialogComponent,
} from './create-group-dialog.component';
import { switchMap } from 'rxjs';
import { MessageService } from '../../../shared/services/message.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'orda-group-details',
  template: `
    <div class="container">
      <div class="header">
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-card-title>{{ group()?.name }}</mat-card-title>
            @if (group()?.desc) {
              <mat-card-subtitle>{{ group()?.desc }}</mat-card-subtitle>
            }
            @if (group()?.deposit ?? 0 > 0) {
              <mat-card-subtitle>{{
                group()?.deposit | ordaCurrency
              }}</mat-card-subtitle>
            }
          </mat-card-header>

          <mat-card-actions align="end">
            <button mat-button (click)="editGroup()">edit</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="content">
        @if (group()) {
          <orda-products-overview
            [products]="group()?.products ?? []"
            [group]="group()?.id ?? ''"
          />
        }
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
      }
      .header {
        margin: 0.5em 0.5em;
      }

      .content {
        flex-grow: 1;
      }

      .footer {
        margin: 0.5em 0.5em;
        display: flex;
        justify-content: flex-end;
        gap: 1em;
      }
    `,
  ],
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ProductsOverviewComponent,
    OrdaCurrencyPipe,
    JsonPipe,
  ],
})
export class GroupDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  assortmentService = inject(AssortmentService);
  messageService = inject(MessageService);

  dialog = inject(MatDialog);

  group = signal<Group | undefined>(undefined);

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => this.assortmentService.getGroup$(params['id'])),
      )
      .subscribe((group) => {
        this.group.set(group);
      });
  }

  editGroup(): void {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      data: this.group(),
      minWidth: '90vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);

      switch (result.action) {
        case ActionType.EDIT:
          this.assortmentService
            .updateGroup$(this.group()?.id ?? '', result.data)
            .subscribe((res) => {
              this.messageService.send({ title: 'Group updated' });
              this.group.set(res);
            });
          break;
        case ActionType.DELETE:
          this.assortmentService
            .deleteGroup$(this.group()?.id ?? '')
            .subscribe(() => {
              this.messageService.send({
                title: `Group ${this.group()?.name} deleted`,
              });
              this.router.navigate(['/assortment']);
            });
          break;
      }
    });
  }
}
