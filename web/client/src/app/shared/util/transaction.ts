export enum AccountType {
  CUSTOMER,
  FREE,
  PREMIUM,
}

export const AccountTypeKeys = {
  [AccountType.CUSTOMER]: 'account.customer',
  [AccountType.FREE]: 'account.free',
  [AccountType.PREMIUM]: 'account.premium',
};

export enum PaymentOption {
  FREE,
  CASH,
  CARD,
}

export const PaymentOptionKeys = {
  [PaymentOption.FREE]: 'payment.free',
  [PaymentOption.CASH]: 'payment.cash',
  [PaymentOption.CARD]: 'payment.card',
};
