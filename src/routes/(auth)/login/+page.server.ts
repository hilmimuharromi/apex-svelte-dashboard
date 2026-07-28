import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { api, ApiError } from '$lib/server/api';
import type { AuthResponse } from '$lib/types/auth';

export const load: PageServerLoad = async () => {
	// If already logged in, hooks will redirect. Nothing else needed.
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// Basic validation
		const errors: Record<string, string> = {};
		if (!email) errors.email = 'Email is required';
		if (!password) errors.password = 'Password is required';
		if (Object.keys(errors).length) {
			return fail(400, { errors, email });
		}

		try {
			// ── DUMMY MODE ──
			// Comment this block & uncomment the real call below when BE is ready.
			const DUMMY_TOKEN = 'dummy_access_token_' + Date.now();
			cookies.set('access_token', DUMMY_TOKEN, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false, // set to true in production (HTTPS)
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});
			throw redirect(303, '/');

			// ── REAL BE CALL ──
			// const auth = await api.post<AuthResponse>('/auth/login', {
			//   body: { email, password }
			// });
			// cookies.set('access_token', auth.token, {
			//   path: '/',
			//   httpOnly: true,
			//   sameSite: 'lax',
			//   secure: process.env.NODE_ENV === 'production',
			//   maxAge: auth.expiresIn ?? 60 * 60 * 24 * 7
			// });
			// throw redirect(303, '/');
		} catch (e) {
			// Re-throw redirects
			if (e && typeof e === 'object' && 'status' in e && e.status === 303) throw e;

			if (e instanceof ApiError) {
				return fail(e.status, { errors: { _: e.message }, email });
			}
			return fail(500, { errors: { _: 'Unexpected error' }, email });
		}
	}
};
