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
  NONE,
  CASH,
  CARD,
}

export const PaymentOptionKeys = {
  [PaymentOption.NONE]: 'payment.none',
  [PaymentOption.CASH]: 'payment.cash',
  [PaymentOption.CARD]: 'payment.card',
};
