import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, map, of } from "rxjs";

export interface CartItem {
    articleName: string;
    amount?: number;
    price: number;
}

@Injectable()
export class CartService {
  
    // private _articles$: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
    private _articles$: Observable<CartItem[]> 
    private _total$?: Observable<number>;

    constructor() {
        this._articles$ = new BehaviorSubject<CartItem[]>([]);
        this._total$ = this._articles$.pipe(
            map(articles => articles.reduce((acc, article) => acc + article.price, 0))
        );
    }

    public get articles$(): Observable<CartItem[]> {
        return this._articles$;
    }

    public get total$(): Observable<number> {
        return this._total$ ?? of(0);
    }

    public addArticle(article: CartItem): void {
        console.log('addArticle', article);

        // this._articles$.next([...this._articles$.value, article]);
    }

    public removeArticle(article: CartItem): void {
        // this._articles$.next(this._articles$.value.filter(a => a.articleName !== article.articleName));
    }

    public clear(): void {
        // this._articles$.next([]);
    }

}