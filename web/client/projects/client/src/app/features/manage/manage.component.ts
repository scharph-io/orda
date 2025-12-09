import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRipple } from '@angular/material/core';
import { GridColSizeService } from '@orda.shared/services/gridcolsize.service';
import { MatIcon } from '@angular/material/icon';
import { Tile } from '@orda.features/home/home.component';

@Component({
  selector: 'orda-manage',
  imports: [RouterModule, MatButtonModule, MatGridListModule, MatRipple, MatIcon],
  template: `
    <h1>Verwalten</h1>
    <mat-grid-list class="manage-list" [cols]="gridColumns()" [gutterSize]="'0.5rem'">
      @for (tile of primaryTiles(); track tile) {
        <mat-grid-tile mat-ripple (click)="navigateTo(tile.path)" [colspan]="1" [rowspan]="1"
          ><div class="tile-content">
            <mat-icon aria-hidden="false">
              {{ tile.icon }}
            </mat-icon>
            <span class="tile-text">{{ tile.title }}</span>
          </div>
        </mat-grid-tile>
      }
    </mat-grid-list>
  `,
  styles: `
    h1 {
      margin-top: 5vh;
    }

    mat-icon {
      height: 3rem;
      width: 3rem;
      font-size: 3rem;
    }

    .tile-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .tile-text {
      margin-top: 0.25rem;
      font-size: 1.25rem;
    }
  `,
})
export class ManageComponent {
  private readonly router = inject(Router);
  gridColumns = inject(GridColSizeService).size;

  primaryTiles = signal<Tile[]>([
    { title: 'Zurück', path: '/home', icon: 'arrow_back' },
    { title: 'Bestellseiten', path: '/manage/views', icon: 'view_list' },
    {
      title: 'Sortiment',
      path: '/manage/assortment',
      icon: 'inventory_2',
    },
    { title: 'Konten', path: '/manage/accounts', icon: 'account_balance' },

    { title: 'Benutzer', path: '/manage/users', icon: 'people' },
    { title: 'Statistik', path: '/manage/history', icon: 'analytics' },
  ]);

  navigateTo(path: string) {
    this.router.navigate([path]).catch(console.error);
  }
}
