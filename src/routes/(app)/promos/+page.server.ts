import type { PageServerLoad } from './$types';
import { getPromos } from '$lib/server/dummy-data';

export const load: PageServerLoad = async () => {
	return { promos: await getPromos() };
};
