/**
 * Server-side API helper.
 *
 * - Reads BE base URL from PRIVATE_API_BASE_URL env (set in .env).
 * - Forwards the browser's cookies automatically (same-origin SSR).
 * - Returns typed JSON or throws ApiError on non-2xx.
 *
 * Usage (in +page.server.ts / +server.ts / hooks.server.ts):
 *
 *   import { api } from '$lib/server/api';
 *   const res = await api.post<AuthResponse>('/auth/login', { body: { email, password } });
 */
import type { ApiResponse } from '$lib/types/auth';
import { error, redirect, type Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const BASE_URL = env.PRIVATE_API_BASE_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public errors?: Record<string, string>
	) {
		super(message);
	}
}

interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: unknown;
	cookies?: Cookies;        // pass event.cookies to forward browser cookies
	token?: string;           // or pass a raw token directly
	headers?: Record<string, string>;
}

async function request<T>(
	path: string,
	opts: RequestOptions = {}
): Promise<T> {
	const url = `${BASE_URL}${path}`;
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...opts.headers
	};

	// Forward auth cookie or token
	if (opts.token) {
		headers['Authorization'] = `Bearer ${opts.token}`;
	}
	if (opts.cookies) {
		const cookie = opts.cookies.get('access_token');
		if (cookie) headers['Authorization'] = `Bearer ${cookie}`;
	}

	const res = await fetch(url, {
		method: opts.method ?? 'GET',
		headers,
		body: opts.body ? JSON.stringify(opts.body) : undefined
	});

	const text = await res.text();
	const json = text ? JSON.parse(text) : {};

	if (!res.ok) {
		const envelope = json as ApiResponse;
		throw new ApiError(
			res.status,
			envelope.message ?? res.statusText,
			envelope.errors
		);
	}

	// If BE wraps in { data: ... }, unwrap. Otherwise return raw.
	if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
		return json.data as T;
	}
	return json as T;
}

export const api = {
	get: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
	post: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'POST' }),
	put: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'PUT' }),
	patch: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'PATCH' }),
	delete: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'DELETE' }),
};

/**
 * Shorthand: throw a SvelteKit error from an ApiError.
 * Use in load/actions catch blocks.
 */
export function handleApiError(e: unknown): never {
	if (e instanceof ApiError) {
		throw error(e.status, { message: e.message });
	}
	if (e && typeof e === 'object' && 'status' in e) throw e; // already a SvelteKit redirect/error
	throw error(500, 'Unexpected server error');
}

/** Throw redirect — convenience to avoid importing everywhere. */
export function redirect_to(location: string, status: 300 | 301 | 302 | 303 | 307 | 308 = 303): never {
	throw redirect(status, location);
}
