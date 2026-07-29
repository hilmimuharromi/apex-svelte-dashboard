import type { PageServerLoad } from './$types';
import { getDashboard } from '$lib/server/dummy-data';

export const load: PageServerLoad = async () => {
	return { dashboard: await getDashboard() };
};
