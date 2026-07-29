import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('access_token', { path: '/' });
	throw redirect(303, '/login');
};

// Also support GET for simple link-based logout
export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('access_token', { path: '/' });
	throw redirect(303, '/login');
};
