export enum PaymentOption {
	CASH,
	ACCOUNT,
  FREE,
  SPONSOR
}

export const PaymentOptionKeys = {
	// [PaymentOption.CASH]: 'payment.cash',
	[PaymentOption.CASH]: 'Bar',
	// [PaymentOption.ACCOUNT]: 'payment.account',
	[PaymentOption.ACCOUNT]: 'Konto',
  [PaymentOption.FREE]: 'Frei',
  [PaymentOption.SPONSOR]: 'Sponsor'
};
