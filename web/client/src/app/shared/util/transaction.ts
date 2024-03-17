export enum AccountType {
  CASH,
  FREE,
  PREMIUM,
}

export const AccountTypeKeys = {
  [AccountType.CASH]: 'account.cash',
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
