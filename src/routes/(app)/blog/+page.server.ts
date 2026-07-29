import type { PageServerLoad } from './$types';
import { getBlogPosts } from '$lib/server/dummy-data';

export const load: PageServerLoad = async () => {
	return { posts: await getBlogPosts() };
};
