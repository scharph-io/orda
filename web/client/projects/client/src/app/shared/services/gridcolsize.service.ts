import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { B, ViewBreakpointService } from './view-breakpoint.service';
import { toSignal } from '@angular/core/rxjs-interop';

const DEFAULT = 4;
const FORMATS: Record<B, number> = {
	XSmall: 2,
	Small: 4,
	Medium: 5,
	Large: 6,
};

@Injectable({
	providedIn: 'root',
})
export class GridColSizeService {
	private breakpoint = inject(ViewBreakpointService);

	public size = toSignal(this.getSize(), {
		initialValue: 4,
	});

	private getSize(): Observable<number> {
		return this.breakpoint.getBreakpoint().pipe(
			map((size) => {
				return FORMATS[size] ?? DEFAULT;
			}),
		);
	}
}
