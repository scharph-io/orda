import { ComponentType } from '@angular/cdk/portal';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, filter, Observer } from 'rxjs';

export abstract class EntityManager<T> {
	dialog = inject(MatDialog);

	public abstract create(): void;

	public abstract delete(t: T): void;

	public abstract edit(t: T): void;

	protected dialogClosed<T, D = unknown, R = unknown>(c: ComponentType<T>, data: D) {
		return this.dialog
			.open<T, D, R>(c, {
				data: data,
			})
			.afterClosed()
			.pipe(filter((r) => r !== undefined));
	}

	protected fnObserver<T>(fn: (t: T) => void): Observer<T> {
		return {
			next: (v) => {
				fn(v);
			},
			error: (err) => {
				console.log(err.message);
			},
			complete: () => EMPTY,
		};
	}
}
