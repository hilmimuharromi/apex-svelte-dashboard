import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { api, ApiError } from '$lib/server/api';
import type { AuthResponse } from '$lib/types/auth';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// Validation
		const errors: Record<string, string> = {};
		if (!name || name.length < 2) errors.name = 'Name is required';
		if (!email) errors.email = 'Email is required';
		if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
		if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
		if (Object.keys(errors).length) {
			return fail(400, { errors, name, email });
		}

		try {
			// ── DUMMY MODE ──
			const DUMMY_TOKEN = 'dummy_access_token_' + Date.now();
			cookies.set('access_token', DUMMY_TOKEN, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false,
				maxAge: 60 * 60 * 24 * 7
			});
			throw redirect(303, '/');

			// ── REAL BE CALL ──
			// const auth = await api.post<AuthResponse>('/auth/register', {
			//   body: { name, email, password }
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
			if (e && typeof e === 'object' && 'status' in e && e.status === 303) throw e;

			if (e instanceof ApiError) {
				return fail(e.status, { errors: { _: e.message }, name, email });
			}
			return fail(500, { errors: { _: 'Unexpected error' }, name, email });
		}
	}
};
