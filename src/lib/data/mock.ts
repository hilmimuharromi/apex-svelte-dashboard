import type { StatusPillStatus } from '$lib/ui/StatusPill.svelte';

export type Order = {
	id: string;
	customer: { name: string; email: string; initials: string };
	product: string;
	amount: number;
	status: StatusPillStatus;
	date: string;
	items: number;
};

export type Product = {
	id: string;
	name: string;
	category: string;
	price: number;
	stock: number;
	status: 'Active' | 'Draft' | 'Archived';
	sales: number;
};

export type Customer = {
	id: string;
	name: string;
	email: string;
	initials: string;
	plan: 'Free' | 'Pro' | 'Business' | 'Enterprise';
	status: 'Active' | 'Inactive' | 'Suspended';
	ltv: number;
	joined: string;
};

// ── Orders ──────────────────────────────────────────────────────────────────
const STATUSES: StatusPillStatus[] = ['Completed', 'Processing', 'Pending', 'Cancelled'];
const PRODUCTS = [
	'Pro Dashboard License', 'Enterprise License', 'Team Plan Upgrade',
	'Single License', 'Add-on: Analytics', 'Add-on: Export', 'White-label Bundle'
];

const NAMES = [
	['Emma', 'Wilson'], ['James', 'Chen'], ['Sofia', 'Garcia'], ['Alex', 'Thompson'],
	['Maria', 'Santos'], ['David', 'Kim'], ['Sarah', 'Johnson'], ['Marcus', 'Brown'],
	['Priya', 'Patel'], ['Liam', 'O\'Brien'], ['Yuki', 'Tanaka'], ['Nina', 'Rossi'],
	['Carlos', 'Mendez'], ['Fatima', 'Al-Hassan'], ['Jack', 'Williams'],
	['Anya', 'Petrov'], ['Omar', 'Khalid'], ['Ingrid', 'Berg'], ['Kofi', 'Asante'],
	['Mei', 'Lin'], ['Rafael', 'Costa'], ['Zara', 'Ahmed'], ['Ethan', 'Clarke'],
	['Amara', 'Diallo'], ['Lucas', 'Moura']
];

function rng(seed: number) {
	let s = seed;
	return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

export function generateOrders(n = 80): Order[] {
	const r = rng(42);
	return Array.from({ length: n }, (_, i) => {
		const [first, last] = NAMES[i % NAMES.length];
		const idx = Math.floor(r() * PRODUCTS.length);
		const prices = [299, 1499, 599, 79, 99, 49, 1999];
		const date = new Date(2026, Math.floor(r() * 7), Math.floor(r() * 28) + 1);
		return {
			id: `ORD-${7900 - i}`,
			customer: { name: `${first} ${last}`, email: `${first.toLowerCase()}@example.com`, initials: `${first[0]}${last[0]}` },
			product: PRODUCTS[idx],
			amount: prices[idx],
			status: STATUSES[Math.floor(r() * STATUSES.length)],
			date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
			items: Math.floor(r() * 3) + 1
		};
	});
}

export function generateProducts(n = 40): Product[] {
	const r = rng(99);
	const cats = ['License', 'Subscription', 'Add-on', 'Bundle'];
	const statuses: Product['status'][] = ['Active', 'Active', 'Active', 'Draft', 'Archived'];
	return PRODUCTS.flatMap((name, pi) =>
		Array.from({ length: Math.ceil(n / PRODUCTS.length) }, (_, i) => ({
			id: `PRD-${(pi + 1) * 100 + i}`,
			name: i === 0 ? name : `${name} (v${i + 1})`,
			category: cats[pi % cats.length],
			price: [299, 1499, 599, 79, 99, 49, 1999][pi],
			stock: Math.floor(r() * 500) + 50,
			status: statuses[Math.floor(r() * statuses.length)],
			sales: Math.floor(r() * 300) + 10
		}))
	).slice(0, n);
}

export function generateCustomers(n = 60): Customer[] {
	const r = rng(77);
	const plans: Customer['plan'][] = ['Free', 'Pro', 'Pro', 'Business', 'Enterprise'];
	const statuses: Customer['status'][] = ['Active', 'Active', 'Active', 'Inactive', 'Suspended'];
	return NAMES.concat(NAMES.slice(0, n - NAMES.length)).slice(0, n).map(([first, last], i) => {
		const plan = plans[Math.floor(r() * plans.length)];
		const ltvMap = { Free: 0, Pro: 299 * (Math.floor(r() * 12) + 1), Business: 599 * (Math.floor(r() * 12) + 1), Enterprise: 1499 * (Math.floor(r() * 12) + 1) };
		const date = new Date(2024, Math.floor(r() * 12), Math.floor(r() * 28) + 1);
		return {
			id: `USR-${1000 + i}`,
			name: `${first} ${last}`,
			email: `${first.toLowerCase()}.${last.toLowerCase().replace("'", '')}@example.com`,
			initials: `${first[0]}${last[0]}`,
			plan,
			status: statuses[Math.floor(r() * statuses.length)],
			ltv: ltvMap[plan],
			joined: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
		};
	});
}
