import type { PageServerLoad } from './$types';
import { getProducts } from '$lib/server/dummy-data';

export const load: PageServerLoad = async () => {
	return { products: await getProducts() };
};
