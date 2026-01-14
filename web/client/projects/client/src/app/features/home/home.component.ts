import { Component, inject, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SessionService } from '@orda.core/services/session.service';
import { NavSubHeaderComponent } from '@orda.shared/components/nav-sub-header/nav-sub-header';

export interface Tile {
  title: string;
  path: string;
  icon: string;
  canActivate?: () => boolean;
}

@Component({
  selector: 'orda-home',
  imports: [MatGridListModule, MatIcon, NavSubHeaderComponent],
  template: `
    <div class="min-h-full">
      <orda-nav-sub-header [title]="'Wilkommen, ' + sessionService.user().username" />
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
export class HomeComponent {
  sessionService = inject(SessionService);
  private readonly router = inject(Router);

  // gridCol = inject(GridColSizeService);

  primaryTiles = signal<Tile[]>([
    {
      title: 'Verwalten',
      path: '/manage',
      icon: 'settings',
      canActivate: () => this.sessionService.hasAdminRole(),
    },
    {
      title: 'Geschäft',
      path: '/order',
      icon: 'storefront',
    },
  ]);

  navigateTo(path: string) {
    return this.router.navigate([path]);
  }
}
