import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface CartItem {
	id: string;
	name: string;
	desc?: string;
	quantity: number;
	price: number;
}

@Injectable({ providedIn: 'root' })
export class OrderStoreService {
	private _items: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);

	public items = signal<CartItem[]>([]);

	public totalQty = computed(() => this.items().filter((a) => a.quantity !== 0));

	public subtotal = computed(() =>
		this.items().reduce((acc, product) => acc + product.price * product.quantity, 0),
	);

	public addItem2(item: CartItem): void {
		if (this.items().find((a) => a.id === item.id)) {
			this.items.update((items) =>
				items.map((a) =>
					a.id === item.id
						? {
								...a,
								quantity: item.quantity > 0 ? a.quantity + 1 : a.quantity - 1,
							}
						: a,
				),
			);
		} else {
			this.items.update((items) => [...items, item]);
		}
	}

	public removeItem2(item: CartItem): void {
		if (item.quantity > 1 || item.quantity < -1) {
			this.items.update((items) =>
				items.map((a) =>
					a.id === item.id
						? {
								...a,
								quantity: item.quantity > 0 ? a.quantity - 1 : a.quantity + 1,
							}
						: a,
				),
			);
		} else {
			this.items.update((items) => items.filter((a) => a.id !== item.id));
		}
	}

	public clear2(): void {
		this.items.update(() => []);
	}

	public readonly items$: Observable<CartItem[]> = this._items
		.asObservable()
		.pipe(map((items) => items.filter((a) => a.quantity !== 0)));

	public readonly totalQty$: Observable<number> = this._items.pipe(
		map((products) =>
			products.reduce(
				(acc, product) => acc + (product.quantity > 0 ? product.quantity : -1 * product.quantity),
				0,
			),
		),
	);

	public readonly subtotal$: Observable<number> = this._items.pipe(
		map((products) => products.reduce((acc, product) => acc + product.price * product.quantity, 0)),
	);

	addItem(item: CartItem): void {
		if (this._items.getValue().find((a) => a.id === item.id)) {
			this._items.next(
				this._items.getValue().map((a) =>
					a.id === item.id
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
					a.id === item.id
						? {
								...a,
								quantity: item.quantity > 0 ? a.quantity - 1 : a.quantity + 1,
							}
						: a,
				),
			);
		} else {
			this._items.next(this._items.getValue().filter((a) => a.id !== item.id));
		}
	}

	clear(): void {
		this._items.next([]);
	}
}
