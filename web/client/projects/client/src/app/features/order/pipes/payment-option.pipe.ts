import { Pipe, PipeTransform } from '@angular/core';
import { PaymentOption, PaymentOptionKeys } from '../utils/transaction';

@Pipe({
	name: 'paymentOption',
	standalone: true,
})
export class PaymentOptionPipe implements PipeTransform {
	transform(value: PaymentOption): string {
		return PaymentOptionKeys[value];
	}
}
