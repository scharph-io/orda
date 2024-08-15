import {
  Component,
  effect,
  Inject,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MatListModule } from '@angular/material/list';
import { ProductsOverviewComponent } from '../product/products-overview.component';
import { ActivatedRoute } from '@angular/router';
import { AssortmentService } from '../../../shared/services/assortment.service';
import { Group } from '../../../shared/model/product';
import { JsonPipe } from '@angular/common';
import { OrdaCurrencyPipe } from '../../../shared/currency.pipe';

@Component({
  selector: 'orda-group-details',
  template: `
    <div class="container">
      <div class="header">
        <h3>{{ group()?.name }}</h3>
      </div>
      <div class="content">
        {{ group()?.desc }}
        {{ group()?.deposit | ordaCurrency }}
        @if (group(); as g) {
          <orda-products-overview [group]="g" />
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
        display: flex;
        justify-content: space-between;
        flex-direction: row;
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
    ProductsOverviewComponent,
    OrdaCurrencyPipe,
  ],
})
export class GroupDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  assortmentService = inject(AssortmentService);

  groupId = signal<string>('');
  group = signal<Group | undefined>(undefined);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.groupId.set(params['id']);
    });
  }
  constructor() {
    effect(() => {
      this.assortmentService.getGroup$(this.groupId()).subscribe((data) => {
        this.group?.set(data);
      });
    });
  }
}
