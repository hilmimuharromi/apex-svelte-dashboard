import { json } from '@sveltejs/kit';
import { getCustomers } from '$lib/server/dummy-data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await getCustomers();
	return json({ success: true, data });
};
