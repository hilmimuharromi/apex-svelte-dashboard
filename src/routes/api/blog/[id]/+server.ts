import { json, error } from '@sveltejs/kit';
import { updateBlogPost, deleteBlogPost } from '$lib/server/dummy-data';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();
		const data = await updateBlogPost(params.id, body);
		return json({ success: true, data });
	} catch (e: unknown) {
		throw error(404, { message: e instanceof Error ? e.message : 'Not found' });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const data = await deleteBlogPost(params.id);
	return json({ success: true, data });
};
