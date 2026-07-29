import type { PageServerLoad } from './$types';
import { getCustomers } from '$lib/server/dummy-data';

export const load: PageServerLoad = async () => {
	return { customers: await getCustomers() };
};
