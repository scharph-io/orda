export enum PaymentOption {
	CASH,
	ACCOUNT,
}

export const PaymentOptionKeys = {
	// [PaymentOption.CASH]: 'payment.cash',
	[PaymentOption.CASH]: 'Barzahlung',
	// [PaymentOption.ACCOUNT]: 'payment.account',
	[PaymentOption.ACCOUNT]: 'Kontozahlung',
};
