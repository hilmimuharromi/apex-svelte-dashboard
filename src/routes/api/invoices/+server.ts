import { json } from '@sveltejs/kit';
import { getInvoices } from '$lib/server/dummy-data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await getInvoices();
	return json({ success: true, data });
};
