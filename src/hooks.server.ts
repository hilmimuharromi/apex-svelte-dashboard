/**
 * SSR auth hook — runs on every request.
 *
 * 1. Reads `access_token` cookie.
 * 2. If present → calls BE `/auth/me` to validate & get user → sets locals.user.
 * 3. If BE is unreachable (template mode) → falls back to dummy user so the app still works.
 *
 * When you connect a real backend, remove the DUMMY fallback block.
 */
import { redirect, type Handle } from '@sveltejs/kit';
import { api, ApiError } from '$lib/server/api';
import type { User } from '$lib/types/auth';

// ── DUMMY MODE: remove when connecting real BE ──────────────────────────
const DUMMY_USER: User = {
	id: 'usr_001',
	name: 'Admin User',
	email: 'admin@apex.dev',
	role: 'Admin',
	avatar: null
};
const DUMMY_MODE = true; // flip to false when BE is ready
// ────────────────────────────────────────────────────────────────────────

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('access_token');
	event.locals.token = token ?? null;
	event.locals.user = null;

	if (token) {
		if (DUMMY_MODE) {
			// Template mode: any token = logged in
			event.locals.user = DUMMY_USER;
		} else {
			// Real BE: validate token
			try {
				const user = await api.get<User>('/auth/me', {
					cookies: event.cookies
				});
				event.locals.user = user;
			} catch (e) {
				// Token invalid/expired — clear it
				if (e instanceof ApiError && e.status === 401) {
					event.cookies.delete('access_token', { path: '/' });
				}
			}
		}
	}

	// Redirect to /login if accessing protected route without auth
	const isPublicPath = PUBLIC_PATHS.some((p) => event.url.pathname.startsWith(p));
	if (!event.locals.user && !isPublicPath) {
		throw redirect(303, '/login');
	}

	// Redirect to / if already logged in and accessing auth pages
	if (event.locals.user && isPublicPath) {
		throw redirect(303, '/');
	}

	return resolve(event);
};
