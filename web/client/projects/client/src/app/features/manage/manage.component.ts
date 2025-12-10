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
    <div class="min-h-full">
      <header
        class="relative after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10"
      >
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div class="flex">
            <button mat-icon-button class="mr-4" (click)="navigateBack()">
              <mat-icon class="tile">arrow_back</mat-icon>
            </button>
            <h1 class="text-center text-4xl font-bold">Verwalten</h1>
          </div>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ul role="list" class="divide-y divide-white/5">
            @for (tile of primaryTiles(); track tile) {
              <li
                class="flex justify-center gap-x-4 py-3"
                tabindex="0"
                (click)="navigateTo(tile.path)"
                (keydown)="navigateTo(tile.path)"
              >
                <div
                  class="flex min-w-0 gap-x-4 items-center place-content-stretch"
                  (click)="navigateTo(tile.path)"
                  (keydown)="navigateTo(tile.path)"
                  tabindex="0"
                >
                  <mat-icon class="icon-large">
                    {{ tile.icon }}
                  </mat-icon>
                  <div class="min-w-0 flex-auto">
                    <p class="text-xl font-semibold">{{ tile.title }}</p>
                  </div>
                  <div class="w-30"></div>
                  <mat-icon class="size-14 grow"> chevron_right </mat-icon>
                </div>
              </li>
            }
          </ul>
        </div>
      </main>
    </div>
  `,
  styles: ``,
})
export class ManageComponent {
  private readonly router = inject(Router);
  gridColumns = inject(GridColSizeService).size;

  primaryTiles = signal<Tile[]>([
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

  navigateBack() {
    this.router.navigate(['/home']).catch(console.error);
  }
}
