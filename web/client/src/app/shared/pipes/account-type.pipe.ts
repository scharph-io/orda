import { Pipe, PipeTransform } from '@angular/core';
import { AccountType, AccountTypeKeys } from '../util/transaction';

@Pipe({
  name: 'accountType',
  standalone: true,
})
export class AccountTypePipe implements PipeTransform {
  transform(value: AccountType, args?: any): string {
    return AccountTypeKeys[value];
  }
}
