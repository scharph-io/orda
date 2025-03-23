export enum PaymentOption {
	CASH,
	ACCOUNT,
}

export const PaymentOptionKeys = {
	[PaymentOption.CASH]: 'payment.cash',
	[PaymentOption.ACCOUNT]: 'payment.account',
};
