import { PaymentOption } from '@orda.features/order/utils/transaction';

export function formatISOWithOffset(date: Date) {
		const pad = (n: number) => String(n).padStart(2, '0');

		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1);
		const day = pad(date.getDate());
		const hour = pad(date.getHours());
		const minute = pad(date.getMinutes());
		const second = pad(date.getSeconds());

		const offset = -date.getTimezoneOffset();
		const sign = offset >= 0 ? '+' : '-';
		const oh = pad(Math.floor(Math.abs(offset) / 60));
		const om = pad(Math.abs(offset) % 60);

		return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${oh}:${om}`;
}

export const keyToNumber = (key: string | number) => {
	return Number(key) as PaymentOption;
};

