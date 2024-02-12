import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

export interface CartItem {
  uuid: string;
  name: string;
  desc?: string;
  quantity: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private _items: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>(
    [],
  );

  public readonly items$: Observable<Array<CartItem>> = this._items
    .asObservable()
    .pipe(map((items) => items.filter((a) => a.quantity !== 0)));

  public readonly total$: Observable<number> = this._items.pipe(
    map((articles) =>
      articles.reduce(
        (acc, article) => acc + article.price * article.quantity,
        0,
      ),
    ),
  );

  addItem(item: CartItem): void {
    if (this._items.getValue().find((a) => a.uuid === item.uuid)) {
      this._items.next(
        this._items.getValue().map((a) =>
          a.uuid === item.uuid
            ? {
                ...a,
                quantity: item.quantity > 0 ? a.quantity + 1 : a.quantity - 1,
              }
            : a,
        ),
      );
    } else {
      this._items.next([...this._items.getValue(), item]);
    }
  }

  removeItem(item: CartItem): void {
    if (item.quantity > 1 || item.quantity < -1) {
      this._items.next(
        this._items.getValue().map((a) =>
          a.uuid === item.uuid
            ? {
                ...a,
                quantity: item.quantity > 0 ? a.quantity - 1 : a.quantity + 1,
              }
            : a,
        ),
      );
    } else {
      this._items.next(
        this._items.getValue().filter((a) => a.uuid !== item.uuid),
      );
    }
  }

  clear(): void {
    this._items.next([]);
  }
}
