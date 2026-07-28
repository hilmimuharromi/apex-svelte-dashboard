/**
 * Client-side API helper.
 *
 * - Uses SvelteKit's relative fetch (same-origin → cookies sent automatically).
 * - Works in browser only (use $lib/server/api for SSR load/actions).
 *
 * Usage (in components / +page.ts):
 *
 *   import { clientApi } from '$lib/api';
 *   const data = await clientApi.get<User[]>('/users');
 */
import type { ApiResponse } from '$lib/types/auth';

export class ClientApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public errors?: Record<string, string>
	) {
		super(message);
	}
}

interface ClientRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: unknown;
	headers?: Record<string, string>;
	query?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(
	path: string,
	opts: ClientRequestOptions = {}
): Promise<T> {
	const url = buildUrl(path, opts.query);

	const res = await fetch(url, {
		method: opts.method ?? 'GET',
		headers: {
			'Content-Type': 'application/json',
			...opts.headers
		},
		credentials: 'same-origin', // send cookies
		body: opts.body ? JSON.stringify(opts.body) : undefined
	});

	const text = await res.text();
	const json = text ? JSON.parse(text) : {};

	if (!res.ok) {
		const envelope = json as ApiResponse;
		throw new ClientApiError(
			res.status,
			envelope.message ?? res.statusText,
			envelope.errors
		);
	}

	if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
		return json.data as T;
	}
	return json as T;
}

function buildUrl(path: string, query?: ClientRequestOptions['query']): string {
	if (!query) return path;
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value));
	}
	const qs = params.toString();
	return qs ? `${path}?${qs}` : path;
}

export const clientApi = {
	get: <T>(path: string, opts?: Omit<ClientRequestOptions, 'method' | 'body'>) =>
		request<T>(path, { ...opts, method: 'GET' }),
	post: <T>(path: string, opts?: Omit<ClientRequestOptions, 'method'>) =>
		request<T>(path, { ...opts, method: 'POST' }),
	put: <T>(path: string, opts?: Omit<ClientRequestOptions, 'method'>) =>
		request<T>(path, { ...opts, method: 'PUT' }),
	patch: <T>(path: string, opts?: Omit<ClientRequestOptions, 'method'>) =>
		request<T>(path, { ...opts, method: 'PATCH' }),
	delete: <T>(path: string, opts?: Omit<ClientRequestOptions, 'method'>) =>
		request<T>(path, { ...opts, method: 'DELETE' }),
};
