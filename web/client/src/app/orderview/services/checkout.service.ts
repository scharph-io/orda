import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CartItem } from '../cart/cart.store';
import { catchError, throwError } from 'rxjs';

export enum AccountType {
  CUSTOMER,
  FREE,
  ADVANCED,
}

export const AccountTypeKeys = {
  [AccountType.CUSTOMER]: 'customer',
  [AccountType.FREE]: 'free',
  [AccountType.ADVANCED]: 'advanced',
};

export enum PaymentOption {
  FREE,
  CASH,
  CARD,
}

export const PaymentOptionKeys = {
  [PaymentOption.FREE]: 'free',
  [PaymentOption.CASH]: 'cash',
  [PaymentOption.CARD]: 'card',
};

export interface CheckoutData {
  items: CartItem[];
  total: number;
  accountType: AccountType;
  paymentOption: PaymentOption;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  http = inject(HttpClient);

  checkout(checkoutData: CheckoutData) {
    return this.http
      .post<{
        success: boolean;
      }>('http://localhost:8080/restricted', checkoutData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else if (error.status === 401) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      return throwError(() => new Error('Invalid username or password'));
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () =>
        new Error(
          `Checkout failed ${error.status === 0 ? '' : ` (ERR${error.status})`}`,
        ),
    );
  }
}
