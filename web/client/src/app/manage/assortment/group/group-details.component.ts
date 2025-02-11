import { Component, inject, OnInit, signal } from '@angular/core';
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
import { switchMap, tap } from 'rxjs';
import { MessageService } from '../../../shared/services/message.service';
import { TranslocoModule } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

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
              <mat-card-subtitle
                >{{ 'deposit' | transloco }}:
                {{ group()?.deposit | ordaCurrency }}</mat-card-subtitle
              >
            }
          </mat-card-header>

          <mat-card-actions align="end">
            <button mat-button (click)="editGroup()">
              {{ 'group.edit' | transloco }}
            </button>
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
    imports: [
        MatDialogModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        ProductsOverviewComponent,
        OrdaCurrencyPipe,
        TranslocoModule,
    ]
})
export class GroupDetailsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  assortmentService = inject(AssortmentService);
  messageService = inject(MessageService);

  dialog = inject(MatDialog);

  group = toSignal(
    inject(ActivatedRoute).params.pipe(
      switchMap((params) => inject(AssortmentService).getGroup$(params['id'])),
    ),
  );

  editGroup(): void {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      data: this.group(),
      minWidth: '30vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);

      if (!result) {
        return;
      }

      switch (result.action) {
        case ActionType.EDIT:
          this.group = toSignal(
            this.assortmentService
              .updateGroup$(this.group()?.id ?? '', result.data)
              .pipe(
                tap((res) => {
                  this.messageService.send({
                    title: `Group '${res.name}' updated`,
                  });
                }),
              ),
          );

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
