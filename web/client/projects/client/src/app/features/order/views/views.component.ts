import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

// Components
import { OrderDesktopComponent } from '@orda.features/order/views/desktop/desktop.component';
import { OrderMobileComponent } from '@orda.features/order/views/mobile/mobile.component';

// Services / Models
import { ToolbarTitleService } from '@orda.shared/services/toolbar-title.service';
import { ViewService } from '@orda.features/data-access/services/view/view.service';
import { View } from '@orda.core/models/view';

@Component({
  selector: 'orda-views',
  imports: [OrderDesktopComponent, OrderMobileComponent],
  template: `
    @if (isMobile()) {
      <orda-order-mobile [viewid]="view_id()" />
    } @else {
      <orda-order-desktop [viewid]="view_id()" />
    }
  `,
})
export class ViewsComponent {
  toolbarTitleService = inject(ToolbarTitleService);
  viewService = inject(ViewService);
  breakpointObserver = inject(BreakpointObserver);

  view_id = signal<string>(inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '');

  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  view = rxResource<View, string>({
    params: () => this.view_id(),
    stream: ({ params }) => this.viewService.readById(params),
  });

  constructor() {
    effect(() => {
      if (this.view.hasValue()) {
        this.toolbarTitleService.title.set(this.view.value().name);
      }
    });

    inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.toolbarTitleService.title.set('');
      }
    });
  }
}
