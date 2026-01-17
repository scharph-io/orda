import { ComponentType } from '@angular/cdk/portal';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

export abstract class EntityManager<T> {
  dialog = inject(MatDialog);

  public abstract create(): void;

  public abstract delete(t: T): void;

  public abstract edit(t: T): void;

  protected dialogClosed<T, D = unknown, R = unknown>(c: ComponentType<T>, data: D) {
    return this.dialog
      .open<T, D, R>(c, {
        data,
        minHeight: '18rem',
      })
      .afterClosed()
      .pipe(filter((r) => r !== undefined));
  }
}
