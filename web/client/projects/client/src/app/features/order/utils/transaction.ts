export enum PaymentOption {
	ACCOUNT,
	CASH,
}

export const PaymentOptionKeys = {
	[PaymentOption.ACCOUNT]: 'payment.account',
	[PaymentOption.CASH]: 'payment.cash',
	// [PaymentOption.CARD]: 'payment.card',
};
