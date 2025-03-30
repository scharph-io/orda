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
			.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Large])
			.pipe(
				map(() => {
					// console.log('result');
					// for (const key in result.breakpoints) {
					// 	console.log(key, result.breakpoints[key], result.breakpoints[Breakpoints.Handset]);
					// }
					if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
						return 'mobile';
					} else if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) {
						return 'tablet';
					} else if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
						return 'large';
					}
					return 'unknown';
				}),
			);
	}
}
