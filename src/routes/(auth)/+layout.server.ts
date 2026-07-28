import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Already logged in? Go to dashboard.
	if (locals.user) {
		throw redirect(303, '/');
	}
	return {};
};
