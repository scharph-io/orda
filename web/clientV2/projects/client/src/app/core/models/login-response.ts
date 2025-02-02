export interface LoginResponse<T> {
	message: string;
	data: T;
}

export interface UserData {
	username: string;
	role: string;
}
