import { Pipe, PipeTransform } from '@angular/core';
import { PaymentOption, PaymentOptionKeys } from '../util/transaction';

@Pipe({
  name: 'paymentOption',
  standalone: true,
})
export class PaymentOptionPipe implements PipeTransform {
  transform(value: PaymentOption, args?: any): any {
    return PaymentOptionKeys[value];
  }
}
