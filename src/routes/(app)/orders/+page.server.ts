import type { PageServerLoad } from './$types';
import { getOrders } from '$lib/server/dummy-data';

export const load: PageServerLoad = async () => {
	return { orders: await getOrders() };
};
