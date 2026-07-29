import type { PageServerLoad } from './$types';
import { getInvoices } from '$lib/server/dummy-data';

export const load: PageServerLoad = async () => {
	return { invoices: await getInvoices() };
};
