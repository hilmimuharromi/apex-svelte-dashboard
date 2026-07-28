import type { StatusPillStatus } from '$lib/ui/StatusPill.svelte';

export type Invoice = {
	id: string;
	number: string;
	client: { name: string; email: string; company: string };
	amount: number;
	status: 'Paid' | 'Pending' | 'Overdue' | 'Draft';
	issued: string;
	due: string;
	items: { desc: string; qty: number; price: number }[];
};

const CLIENTS = [
	{ name: 'Emma Wilson', email: 'emma@acme.co', company: 'Acme Corp' },
	{ name: 'James Chen', email: 'james@globex.io', company: 'Globex Inc' },
	{ name: 'Sofia Garcia', email: 'sofia@initech.com', company: 'Initech' },
	{ name: 'Alex Thompson', email: 'alex@umbrella.co', company: 'Umbrella LLC' },
	{ name: 'Maria Santos', email: 'maria@stark.com', company: 'Stark Industries' },
	{ name: 'David Kim', email: 'david@wayne.co', company: 'Wayne Enterprises' },
	{ name: 'Nina Rossi', email: 'nina@pied.piper', company: 'Pied Piper' }
];

const STATUSES: Invoice['status'][] = ['Paid', 'Paid', 'Paid', 'Pending', 'Overdue', 'Draft'];

function rng(seed: number) { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; }

export function generateInvoices(n = 30): Invoice[] {
	const r = rng(31);
	return Array.from({ length: n }, (_, i) => {
		const client = CLIENTS[i % CLIENTS.length];
		const itemCount = Math.floor(r() * 3) + 1;
		const items = Array.from({ length: itemCount }, () => ({
			desc: ['Dashboard License', 'Custom Development', 'Support Hours', 'Training Session', 'Design Package'][Math.floor(r() * 5)],
			qty: Math.floor(r() * 4) + 1,
			price: [299, 999, 149, 499, 1499][Math.floor(r() * 5)]
		}));
		const amount = items.reduce((s, it) => s + it.qty * it.price, 0);
		const issuedDate = new Date(2026, Math.floor(r() * 7), Math.floor(r() * 28) + 1);
		const dueDate = new Date(issuedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
		const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
		return {
			id: `INV-${2500 - i}`,
			number: `INV-${2026}-${String(2500 - i).padStart(4, '0')}`,
			client,
			amount,
			status: STATUSES[Math.floor(r() * STATUSES.length)],
			issued: fmt(issuedDate),
			due: fmt(dueDate),
			items
		};
	});
}
