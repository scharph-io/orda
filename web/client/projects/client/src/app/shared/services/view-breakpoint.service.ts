import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ViewBreakpointService {
	private breakpointObserver = inject(BreakpointObserver);

	isMobile(): Observable<boolean> {
		return this.breakpointObserver
			.observe([Breakpoints.Handset])
			.pipe(map((result) => result.matches));
	}

	isTablet(): Observable<boolean> {
		return this.breakpointObserver
			.observe([Breakpoints.Tablet])
			.pipe(map((result) => result.matches));
	}

	isDesktop(): Observable<boolean> {
		return this.breakpointObserver.observe([Breakpoints.Web]).pipe(map((result) => result.matches));
	}

	getBreakpoint(): Observable<string> {
		return this.breakpointObserver
			.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletLandscape, Breakpoints.WebLandscape])
			.pipe(
				map(() => {
					if (this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait)) {
						return 'mobile';
					} else if (this.breakpointObserver.isMatched(Breakpoints.TabletLandscape)) {
						return 'tablet';
					} else if (this.breakpointObserver.isMatched(Breakpoints.WebLandscape)) {
						return 'large';
					}
					return 'unknown';
				}),
			);
	}
}
