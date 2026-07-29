/**
 * Server hooks — runs on every request.
 *
 * Reads the `access_token` cookie and populates `locals.user` + `locals.token`.
 *
 * ── DUMMY MODE ──
 * Right now any non-empty token creates a mock user from APP_CONFIG.
 * When the backend is ready, replace the verify block (commented below)
 * with a real /auth/me call that exchanges the token for a user.
 */
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { APP_CONFIG } from '$lib/config';
import type { User } from '$lib/types/auth';
// import { api } from '$lib/server/api';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('access_token');

	// ── DUMMY MODE ──
	if (token) {
		event.locals.user = {
			id: 'usr_001',
			name: APP_CONFIG.user.name,
			email: APP_CONFIG.user.email,
			role: APP_CONFIG.user.role,
			avatar: null
		} satisfies User;
		event.locals.token = token;

		// ── REAL BE MODE (uncomment when backend is ready) ──
		// try {
		// 	const user = await api.get<User>('/auth/me', { token });
		// 	event.locals.user = user;
		// 	event.locals.token = token;
		// } catch {
		// 	// Token invalid/expired — clear it
		// 	event.cookies.delete('access_token', { path: '/' });
		// 	event.locals.user = null;
		// 	event.locals.token = null;
		// }
	} else {
		event.locals.user = null;
		event.locals.token = null;
	}

	// Redirect unauthenticated users to login (except public routes)
	const path = event.url.pathname;
	if (!event.locals.user && !PUBLIC_PATHS.some((p) => path.startsWith(p))) {
		throw redirect(303, '/login');
	}

	return resolve(event);
};
