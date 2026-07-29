import { json } from '@sveltejs/kit';
import { getDashboard } from '$lib/server/dummy-data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await getDashboard();
	return json({ success: true, data });
};
