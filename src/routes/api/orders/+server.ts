import { json } from '@sveltejs/kit';
import { getOrders } from '$lib/server/dummy-data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await getOrders();
	return json({ success: true, data });
};
