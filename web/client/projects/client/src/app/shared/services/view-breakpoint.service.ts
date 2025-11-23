import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

export type B = Extract<keyof typeof Breakpoints, 'XSmall' | 'Small' | 'Medium' | 'Large'>;

const BREAKPOINTS_VALUES = [
	Breakpoints.XSmall,
	Breakpoints.Small,
	Breakpoints.Medium,
	Breakpoints.Large,
];

@Injectable({
	providedIn: 'root',
})
export class ViewBreakpointService {
	private breakpointObserver = inject(BreakpointObserver);

	getBreakpoint(): Observable<B> {
		return this.breakpointObserver.observe(BREAKPOINTS_VALUES).pipe(
			map(() => {
				if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
					return 'XSmall';
				} else if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
					return 'Small';
				} else if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
					return 'Medium';
				} else {
					return 'Large';
				}
			}),
			tap((breakpoint) => {
				console.debug('Current breakpoint:', breakpoint);
			}), // Log the day breakpoint
		);
	}
}
