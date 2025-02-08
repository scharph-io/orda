import { User } from '@core/models/user';

export interface LoginResponse<T> {
	message: string;
	data: T;
}

export type SessionInfo = Partial<Pick<User, 'role' | 'username'>>;
