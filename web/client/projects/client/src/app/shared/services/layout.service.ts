import { Injectable, inject, Signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  // Define what constitutes a "Handset" view
  // We combine standard Handset with XSmall and Small to catch all phone sizes
  private readonly mobileBreakpoints = [Breakpoints.Handset, Breakpoints.XSmall, Breakpoints.Small];

  // Exposed Signal
  public readonly isHandset: Signal<boolean> = toSignal(
    this.breakpointObserver.observe(this.mobileBreakpoints).pipe(
      map((result) => result.matches),
      // shareReplay is good practice if multiple components subscribe to the raw observable,
      // though toSignal handles the subscription management for the signal itself.
      shareReplay(1),
    ),
    { initialValue: false },
  );
}
