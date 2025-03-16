const API = '/api/v1';
export const API_ENDPOINTS = {
	USER: `${API}/user`,
	ACCOUNT: `${API}/account`,
	ACCOUNT_GROUP: `${API}/account-group`,
	ROLE: `${API}/role`,
	ASSORTMENT: `${API}/assortment`,
	VIEW: `${API}/view`,
	ORDER: `${API}/order`,
};
export const StrongPasswordRegx = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
export const DEPOSIT_VALUES = [1000, 1500, 2000];
