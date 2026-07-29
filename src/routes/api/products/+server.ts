import { json } from '@sveltejs/kit';
import { getProducts, createProduct } from '$lib/server/dummy-data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await getProducts();
	return json({ success: true, data });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const data = await createProduct(body);
	return json({ success: true, data }, { status: 201 });
};
