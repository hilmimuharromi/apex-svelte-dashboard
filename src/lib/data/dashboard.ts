import { money } from '$lib/utils';

export type DashboardOrder = {
	id: string;
	customer: { name: string; initials: string };
	product: string;
	amount: number;
	status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
};

export const RECENT_ORDERS: DashboardOrder[] = [
	{ id: 'ORD-10042', customer: { name: 'Emma Wilson', initials: 'EW' }, product: 'Sunscreen Anak SPF50+', amount: 89000, status: 'Completed' },
	{ id: 'ORD-10041', customer: { name: 'Sofia Garcia', initials: 'SG' }, product: 'Body Lotion pelembab', amount: 65000, status: 'Processing' },
	{ id: 'ORD-10040', customer: { name: 'Maria Santos', initials: 'MS' }, product: 'Diaper Cream + Baby Wash', amount: 127000, status: 'Completed' },
	{ id: 'ORD-10039', customer: { name: 'David Kim', initials: 'DK' }, product: 'Face Cream Anak', amount: 78000, status: 'Pending' },
	{ id: 'ORD-10038', customer: { name: 'Priya Patel', initials: 'PP' }, product: 'Sunscreen Anak SPF50+ (100ml)', amount: 119000, status: 'Completed' },
	{ id: 'ORD-10037', customer: { name: 'Yuki Tanaka', initials: 'YT' }, product: 'Hair Conditioner Anak', amount: 48000, status: 'Cancelled' }
];

export const MONTHLY_REVENUE = [
	{ label: 'Jan', value: 28400000 },
	{ label: 'Feb', value: 32100000 },
	{ label: 'Mar', value: 35800000 },
	{ label: 'Apr', value: 37300000 },
	{ label: 'May', value: 41500000 },
	{ label: 'Jun', value: 39200000 },
	{ label: 'Jul', value: 44700000 },
	{ label: 'Aug', value: 46100000 },
	{ label: 'Sep', value: 48900000 },
	{ label: 'Oct', value: 52200000 },
	{ label: 'Nov', value: 55100000 },
	{ label: 'Dec', value: 58295000 }
];

export const TRAFFIC_SOURCES = [
	{ label: 'Instagram', value: 38 },
	{ label: 'Tokopedia', value: 27 },
	{ label: 'Direct', value: 20 },
	{ label: 'WhatsApp', value: 15 }
];

export const GOALS = [
	{ label: 'Monthly Revenue', value: 88, description: `${money(58295000)} of ${money(65000000)}` },
	{ label: 'New Customers', value: 85, description: '847 of 1,000' },
	{ label: 'Repeat Purchase', value: 64, description: '32% of 50%' }
];

export const DASHBOARD_SUMMARY = {
	total: 497995000,
	monthlyAvg: 41499583,
	peakMonth: { label: 'Dec', value: 58295000 },
	yoyGrowth: 162.5
};
