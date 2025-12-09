export enum PaymentOption {
  CASH,
  ACCOUNT,
  FREE,
  SPONSOR,
}

export const PaymentOptionKeys = {
  [PaymentOption.CASH]: 'Bar',
  [PaymentOption.ACCOUNT]: 'Konto',
  [PaymentOption.FREE]: 'Frei',
  [PaymentOption.SPONSOR]: 'Sponsor',
};
