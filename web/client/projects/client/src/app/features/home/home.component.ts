import { Component, inject, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SessionService } from '@orda.core/services/session.service';
import { GridColSizeService } from '@orda.shared/services/gridcolsize.service';

export interface Tile {
  title: string;
  path: string;
  icon: string;
  canActivate?: () => boolean;
}

@Component({
  selector: 'orda-home',
  imports: [MatGridListModule, MatIcon],
  template: `
    <h1>
      Wilkommen,
      {{ sessionService.user().username }}
    </h1>

    <div class="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <div class="md:flex">
        <div class="md:shrink-0">
          <img
            class="h-48 w-full object-cover md:h-full md:w-48"
            src="/img/building.jpg"
            alt="Modern building architecture"
          />
        </div>
        <div class="p-8">
          <div class="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
            Company retreats
          </div>
          <a
            href="#"
            class="mt-1 block text-lg leading-tight font-medium text-black hover:underline"
          >
            Incredible accommodation for your team
          </a>
          <p class="mt-2 text-gray-500">
            Looking to take your team away on a retreat to enjoy awesome food and take in some
            sunshine? We have a list of places to do just that.
          </p>
        </div>
      </div>
    </div>

    <div>
      <div class="bg-sky-50"></div>
      <div class="bg-sky-100"></div>
      <div class="bg-sky-200"></div>
      <div class="bg-sky-300"></div>
      <div class="bg-sky-400"></div>
      <div class="bg-sky-500"></div>
      <div class="bg-sky-600"></div>
      <div class="bg-sky-700"></div>
      <div class="bg-sky-800"></div>
      <div class="bg-sky-900"></div>
      <div class="bg-sky-950"></div>
    </div>

    <mat-grid-list class="manage-list " [cols]="gridCol.size()" [gutterSize]="'0.5rem'">
      @for (tile of primaryTiles(); track tile) {
        @if (tile.canActivate ? tile.canActivate() : true) {
          <mat-grid-tile (click)="navigateTo(tile.path)" [colspan]="1" [rowspan]="1">
            <div class="tile-content">
              <mat-icon aria-hidden="false">
                {{ tile.icon }}
              </mat-icon>
              <span class="tile-text">{{ tile.title }}</span>
            </div>
          </mat-grid-tile>
        }
      }
    </mat-grid-list>

    <!-- <h2>TODOs for v0.2.1</h2>
		<ul>
			<li>Colors</li>
			<li>Order UI settings set grid cols to auto, 2-5</li>
			<li>Manual deposit</li>
		</ul> -->

    <!--		https://lucide.dev/guide/packages/lucide-angular-->
    <!--		https://sebastianviereck.de/httponly-und-secure-cookies-in-angular/-->
    <!-- https://taiga-ui.dev/utils/tokens -->
  `,
  styles: `
    h1 {
      margin-top: 5vh;
      color: var(--color-red-800);
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
      font-size: 1.5rem;
    }
  `,
})
export class HomeComponent {
  sessionService = inject(SessionService);
  private readonly router = inject(Router);

  gridCol = inject(GridColSizeService);

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
