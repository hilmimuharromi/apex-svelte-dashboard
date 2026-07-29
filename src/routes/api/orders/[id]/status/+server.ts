import { json, error } from '@sveltejs/kit';
import { updateOrderStatus } from '$lib/server/dummy-data';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const { status } = await request.json();
		const data = await updateOrderStatus(params.id, status);
		return json({ success: true, data });
	} catch (e: unknown) {
		throw error(404, { message: e instanceof Error ? e.message : 'Not found' });
	}
};
