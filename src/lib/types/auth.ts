/** Shared auth & API types — used by both server and client. */

export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	avatar?: string | null;
}

export interface AuthSession {
	user: User;
	token: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface RegisterInput {
	name: string;
	email: string;
	password: string;
}

/** Standard BE response envelope (adjust to match your backend). */
export interface ApiResponse<T = unknown> {
	success: boolean;
	message?: string;
	data?: T;
	errors?: Record<string, string>;
}

/** Login response shape from BE. */
export interface AuthResponse {
	user: User;
	token: string;
	expiresIn?: number; // seconds
}
