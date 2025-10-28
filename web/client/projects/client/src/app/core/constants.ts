const API = '/api/v1';
export const API_ENDPOINTS = {
	ACCOUNT: `${API}/account`,
	ACCOUNT_GROUP: `${API}/account-group`,
	ACCOUNT_HISTORY: `${API}/account-history`,
	ASSORTMENT: `${API}/assortment`,
	ORDER: `${API}/order`,
	ROLE: `${API}/role`,
	TRANSACTION: `${API}/transactions`,
	STATISTICS: `${API}/stats`,
	USER: `${API}/user`,
	VIEW: `${API}/views`,
};
export const StrongPasswordRegx = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
export const DEPOSIT_VALUES = [5, 10];
