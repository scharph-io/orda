import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Tile } from '@orda.features/home/home.component';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';

@Component({
  selector: 'orda-manage',
  imports: [RouterModule, MatButtonModule, MatGridListModule, MatIcon, NavSubHeaderComponent],
  template: `
    <div class="min-h-full">
      <orda-nav-sub-header title="Verwalten" [showBackButton]="true" />
      <main>
        <div class="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (tile of primaryTiles(); track tile) {
              <li (click)="navigateTo(tile.path)" (keydown)="navigateTo(tile.path)" tabindex="0">
                <a
                  class="flex flex-col items-center justify-center rounded-xl border border-gray-200 px-4 py-6 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
                >
                  <span class="text-2xl mb-2"
                    ><mat-icon class="icon-large">
                      {{ tile.icon }}
                    </mat-icon></span
                  >
                  <span class="text-2xl font-bold">{{ tile.title }}</span>
                </a>
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

  primaryTiles = signal<Tile[]>([
    { title: 'Ansichten', path: '/manage/views', icon: 'grid_view' },
    {
      title: 'Sortiment',
      path: '/manage/assortment',
      icon: 'shelves',
    },
    { title: 'Konten', path: '/manage/accounts', icon: 'account_box' },

    { title: 'Benutzer', path: '/manage/users', icon: 'badge' },
    { title: 'Verlauf', path: '/manage/history', icon: 'history' },
    { title: 'Statistik', path: '/stats', icon: 'analytics' },
  ]);

  navigateTo(path: string) {
    this.router.navigate([path]).catch(console.error);
  }
}
