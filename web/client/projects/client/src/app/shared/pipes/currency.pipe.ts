import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
	name: 'currency',
})
export class OrdaCurrencyPipe extends CurrencyPipe implements PipeTransform {
	override transform(value: any, args?: any): any {
		return super.transform(value / 100, args);
	}
}
