import { json, error } from '@sveltejs/kit';
import { updatePromo, deletePromo } from '$lib/server/dummy-data';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();
		const data = await updatePromo(params.id, body);
		return json({ success: true, data });
	} catch (e: unknown) {
		throw error(404, { message: e instanceof Error ? e.message : 'Not found' });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const data = await deletePromo(params.id);
	return json({ success: true, data });
};
