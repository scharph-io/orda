import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";

export interface CartItem {
    articleName: string;
    amount: number;
    price: number;
}

@Injectable({providedIn: 'root'})
export class CartStore {
    private _items: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);

    public readonly items$: Observable<Array<CartItem>> = this._items.asObservable();

    public readonly total$: Observable<number> = this._items.pipe(
        map(articles => articles.reduce((acc, article) => acc + (article.price*article.amount), 0)),
    );

    addItem(item: CartItem): void {
        console.log('addItem', item);
        if (this._items.getValue().find(a => a.articleName === item.articleName)) {
            this._items.next(this._items.getValue().map(a => a.articleName === item.articleName ? {...a, amount: a.amount + 1} : a));
        } else {
            this._items.next([...this._items.getValue(), item]);
        }
    }

    removeItem(item: CartItem): void {
        this._items.next(this._items.getValue().filter(a => a.articleName !== item.articleName));
    }



    clear(): void {
        this._items.next([]);
    }

}