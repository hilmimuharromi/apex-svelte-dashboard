import { money } from '$lib/utils';

export type Order = {
	id: string;
	customer: { name: string; initials: string };
	product: string;
	amount: number;
	status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
};

export const RECENT_ORDERS: Order[] = [
	{ id: 'ORD-7891', customer: { name: 'Emma Wilson', initials: 'EW' }, product: 'Pro Dashboard License', amount: 299, status: 'Completed' },
	{ id: 'ORD-7890', customer: { name: 'James Chen', initials: 'JC' }, product: 'Team Plan Upgrade', amount: 599, status: 'Processing' },
	{ id: 'ORD-7889', customer: { name: 'Sofia Garcia', initials: 'SG' }, product: 'Enterprise License', amount: 1499, status: 'Completed' },
	{ id: 'ORD-7888', customer: { name: 'Alex Thompson', initials: 'AT' }, product: 'Single License', amount: 79, status: 'Pending' },
	{ id: 'ORD-7887', customer: { name: 'Maria Santos', initials: 'MS' }, product: 'Pro Dashboard License', amount: 299, status: 'Completed' },
	{ id: 'ORD-7886', customer: { name: 'David Kim', initials: 'DK' }, product: 'Team Plan Upgrade', amount: 599, status: 'Cancelled' }
];

export const MONTHLY_REVENUE = [
	{ label: 'Jan', value: 18400 },
	{ label: 'Feb', value: 22100 },
	{ label: 'Mar', value: 25800 },
	{ label: 'Apr', value: 27300 },
	{ label: 'May', value: 31500 },
	{ label: 'Jun', value: 29200 },
	{ label: 'Jul', value: 34700 },
	{ label: 'Aug', value: 36100 },
	{ label: 'Sep', value: 38900 },
	{ label: 'Oct', value: 42200 },
	{ label: 'Nov', value: 45100 },
	{ label: 'Dec', value: 48295 }
];

export const TRAFFIC_SOURCES = [
	{ label: 'Direct', value: 35 },
	{ label: 'Organic', value: 28 },
	{ label: 'Referral', value: 22 },
	{ label: 'Social', value: 15 }
];

export const GOALS = [
	{ label: 'Monthly Revenue', value: 88, description: `${money(48295)} of ${money(55000)}` },
	{ label: 'New Customers', value: 85, description: '847 of 1,000' },
	{ label: 'Conversion Rate', value: 76, description: '3.8% of 5%' }
];

export const DASHBOARD_SUMMARY = {
	total: 397995,
	monthlyAvg: 33166,
	peakMonth: { label: 'Dec', value: 48295 },
	yoyGrowth: 162.5
};
