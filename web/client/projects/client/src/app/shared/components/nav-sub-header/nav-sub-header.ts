import { Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'orda-nav-sub-header',
  imports: [MatIcon],
  template: `
    <header
      class="relative after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10"
    >
      <div class="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div class="flex">
          @if (showBackButton()) {
            <button mat-icon-button class="mr-4" (click)="navigateBack()">
              <mat-icon class="tile">arrow_back</mat-icon>
            </button>
          }
          <h1 class="text-center text-3xl font-bold">{{ title() }}</h1>
        </div>
      </div>
    </header>
  `,
  styles: ``,
})
export class NavSubHeaderComponent {
  title = input.required<string>();
  showBackButton = input<boolean>(false);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route }).catch(console.error);
  }
}
