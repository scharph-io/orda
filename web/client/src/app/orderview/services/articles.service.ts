import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { CartItem } from "../cart/cart.store";

export interface CheckoutData {
  items: CartItem[];
  total: number;
  not_charged: boolean;
}

@Injectable({providedIn: "root"})
export class CheckoutService {
  http = inject(HttpClient);

  checkout(checkoutData: CheckoutData) {
    return this.http.post("http://localhost:8080/restricted", checkoutData);
  }
}
