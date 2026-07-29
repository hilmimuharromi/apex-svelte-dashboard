import type { PageServerLoad } from './$types';
import { getBanners } from '$lib/server/dummy-data';

export const load: PageServerLoad = async () => {
	return { banners: await getBanners() };
};
