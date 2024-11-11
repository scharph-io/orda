import { DialogModule } from '@angular/cdk/dialog';
import {
  Component,
  computed,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GroupsOverviewComponent } from './group/groups-overview.component';
import { MatDialog } from '@angular/material/dialog';
// import { CreateProductDialogComponent } from '../products/create-product-dialog.component';
import {
  ActionType,
  CreateGroupDialogComponent,
} from './group/create-group-dialog.component';
import { AssortmentService } from '../../shared/services/assortment.service';
import { Group } from '../../shared/model/product';
import {
  MessageService,
  Severity,
} from '../../shared/services/message.service';
import { catchError, EMPTY, pipe } from 'rxjs';
import { TranslocoModule } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'orda-assortment-overview',
  template: `
    <div class="toolbar">
      <h2>{{ 'assortment.title' | transloco }}</h2>
      <button mat-fab extended (click)="openGroupAddDialog()">
        <mat-icon>add</mat-icon>
        {{ 'group.new' | transloco }}
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
    TranslocoModule,
  ],
})
export class AssortmentOverviewComponent {
  assortmentService = inject(AssortmentService);
  messageService = inject(MessageService);
  dialog = inject(MatDialog);
  injector = inject(Injector);
  groups = toSignal(this.assortmentService.getGroups$(), { initialValue: [] });

  openGroupAddDialog(): void {
    const dialogRef = this.dialog.open<
      CreateGroupDialogComponent,
      any,
      { action: ActionType; group: Group }
    >(CreateGroupDialogComponent, {
      data: '',
      minWidth: '30vw',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data?.group) {
        return;
      }

      this.assortmentService
        .addGroup$(data?.group)
        .pipe(
          catchError((err) => {
            this.messageService.send(err.statusText);
            return EMPTY;
          }),
        )
        .subscribe((res) => {
          this.messageService.send({
            title: `Group ${data.group.name} added`,
            severity: Severity.INFO,
          });
          this.groups = toSignal(this.assortmentService.getGroups$(), {
            initialValue: [],
            injector: this.injector,
          });
        });
    });
  }
}
