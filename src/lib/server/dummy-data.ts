/**
 * Dummy API — simulates backend responses using mock data.
 *
 * When the real backend is ready, replace calls to dummyApi
 * with `api` from '$lib/server/api' — the signatures match:
 *
 *   // BEFORE (dummy):
 *   const products = await dummyApi.getProducts();
 *
 *   // AFTER (real BE):
 *   const products = await api.get<Product[]>('/products');
 *
 * The response envelope format { success, data } is identical.
 */
import {
	generateProducts,
	generateOrders,
	generateCustomers,
	generateBanners,
	generatePromos,
	generateBlogPosts
} from '$lib/data/mock';
import {
	RECENT_ORDERS,
	MONTHLY_REVENUE,
	TRAFFIC_SOURCES,
	GOALS,
	DASHBOARD_SUMMARY
} from '$lib/data/dashboard';
import { generateInvoices } from '$lib/data/invoices';
import type { Product, Order, Customer, Banner, Promo, BlogPost } from '$lib/types/catalog';
import type { Invoice } from '$lib/data/invoices';

/** Simulate network latency (short, just to exercise loading states). */
function delay<T>(data: T, ms = 50): Promise<T> {
	return new Promise((r) => setTimeout(() => r(data), ms));
}

// ═══════════════════════════════════════════════════════════════
//  In-memory stores (so mutations persist during the session)
// ═══════════════════════════════════════════════════════════════

let _products: Product[] | null = null;
let _orders: Order[] | null = null;
let _customers: Customer[] | null = null;
let _banners: Banner[] | null = null;
let _promos: Promo[] | null = null;
let _blogPosts: BlogPost[] | null = null;
let _invoices: Invoice[] | null = null;

function products(): Product[] {
	return (_products ??= generateProducts(40));
}
function orders(): Order[] {
	return (_orders ??= generateOrders(80));
}
function customers(): Customer[] {
	return (_customers ??= generateCustomers(60));
}
function banners(): Banner[] {
	return (_banners ??= generateBanners());
}
function promos(): Promo[] {
	return (_promos ??= generatePromos());
}
function blogPosts(): BlogPost[] {
	return (_blogPosts ??= generateBlogPosts());
}
function invoices(): Invoice[] {
	return (_invoices ??= generateInvoices(30));
}

// ═══════════════════════════════════════════════════════════════
//  Dashboard
// ═══════════════════════════════════════════════════════════════

export async function getDashboard() {
	return delay({
		recentOrders: RECENT_ORDERS,
		monthlyRevenue: MONTHLY_REVENUE,
		trafficSources: TRAFFIC_SOURCES,
		goals: GOALS,
		summary: DASHBOARD_SUMMARY
	});
}

// ═══════════════════════════════════════════════════════════════
//  Products
// ═══════════════════════════════════════════════════════════════

export async function getProducts(): Promise<Product[]> {
	return delay([...products()]);
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
	const list = products();
	const id = `PRD-${String(list.length + 1).padStart(3, '0')}`;
	const slug = (data.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
	const item: Product = {
		id,
		name: data.name || 'Untitled',
		slug,
		category: data.category || 'Sunscreen',
		shortDescription: (data.description || '').replace(/<[^>]+>/g, '').slice(0, 80) + '...',
		description: data.description || '',
		images: data.images || [`https://api.dicebear.com/7.x/shapes/svg?seed=${slug}`],
		status: data.status || 'Active',
		variants: data.variants || [{ id: `${id}-v0`, name: 'Standard', sku: `SKU-${slug.toUpperCase()}-STD`, price: data.price || 0, stock: data.stock || 0 }],
		ingredients: data.ingredients || '',
		bpomNumber: data.bpomNumber || '',
		ageRange: data.ageRange || '0 bln+',
		skinType: data.skinType || [],
		price: data.price || 0,
		stock: data.stock || 0,
		sales: 0,
		rating: 5.0,
		reviews: 0,
		createdAt: new Date().toISOString()
	};
	list.push(item);
	return delay(item);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
	const list = products();
	const idx = list.findIndex((p) => p.id === id);
	if (idx === -1) throw new Error('Product not found');
	list[idx] = { ...list[idx], ...data, id };
	return delay(list[idx]);
}

export async function deleteProduct(id: string): Promise<{ id: string }> {
	const list = products();
	const idx = list.findIndex((p) => p.id === id);
	if (idx !== -1) list.splice(idx, 1);
	return delay({ id });
}

// ═══════════════════════════════════════════════════════════════
//  Orders
// ═══════════════════════════════════════════════════════════════

export async function getOrders(): Promise<Order[]> {
	return delay([...orders()]);
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
	const list = orders();
	const idx = list.findIndex((o) => o.id === id);
	if (idx === -1) throw new Error('Order not found');
	list[idx].status = status;
	return delay(list[idx]);
}

// ═══════════════════════════════════════════════════════════════
//  Customers
// ═══════════════════════════════════════════════════════════════

export async function getCustomers(): Promise<Customer[]> {
	return delay([...customers()]);
}

// ═══════════════════════════════════════════════════════════════
//  Banners
// ═══════════════════════════════════════════════════════════════

export async function getBanners(): Promise<Banner[]> {
	return delay([...banners()]);
}

export async function createBanner(data: Partial<Banner>): Promise<Banner> {
	const list = banners();
	const id = `BNR-${String(list.length + 1).padStart(3, '0')}`;
	const item: Banner = {
		id,
		title: data.title || '',
		subtitle: data.subtitle || '',
		image: data.image || '',
		link: data.link || '',
		position: data.position || 'home_top',
		status: data.status || 'active',
		sortOrder: data.sortOrder ?? list.length + 1,
		startDate: data.startDate || new Date().toISOString().split('T')[0],
		endDate: data.endDate || ''
	};
	list.push(item);
	return delay(item);
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<Banner> {
	const list = banners();
	const idx = list.findIndex((b) => b.id === id);
	if (idx === -1) throw new Error('Banner not found');
	list[idx] = { ...list[idx], ...data, id };
	return delay(list[idx]);
}

export async function deleteBanner(id: string): Promise<{ id: string }> {
	const list = banners();
	const idx = list.findIndex((b) => b.id === id);
	if (idx !== -1) list.splice(idx, 1);
	return delay({ id });
}

// ═══════════════════════════════════════════════════════════════
//  Promos
// ═══════════════════════════════════════════════════════════════

export async function getPromos(): Promise<Promo[]> {
	return delay([...promos()]);
}

export async function createPromo(data: Partial<Promo>): Promise<Promo> {
	const list = promos();
	const id = `PRM-${String(list.length + 1).padStart(3, '0')}`;
	const item: Promo = {
		id,
		code: data.code || '',
		title: data.title || '',
		type: data.type || 'percentage',
		value: data.value || 0,
		minPurchase: data.minPurchase || 0,
		maxUsage: data.maxUsage || 100,
		usedCount: data.usedCount || 0,
		startDate: data.startDate || new Date().toISOString().split('T')[0],
		endDate: data.endDate || '',
		status: data.status || 'active'
	};
	list.push(item);
	return delay(item);
}

export async function updatePromo(id: string, data: Partial<Promo>): Promise<Promo> {
	const list = promos();
	const idx = list.findIndex((p) => p.id === id);
	if (idx === -1) throw new Error('Promo not found');
	list[idx] = { ...list[idx], ...data, id };
	return delay(list[idx]);
}

export async function deletePromo(id: string): Promise<{ id: string }> {
	const list = promos();
	const idx = list.findIndex((p) => p.id === id);
	if (idx !== -1) list.splice(idx, 1);
	return delay({ id });
}

// ═══════════════════════════════════════════════════════════════
//  Blog
// ═══════════════════════════════════════════════════════════════

export async function getBlogPosts(): Promise<BlogPost[]> {
	return delay([...blogPosts()]);
}

export async function createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
	const list = blogPosts();
	const id = `BLG-${Date.now().toString().slice(-4)}`;
	const slug = (data.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
	const item: BlogPost = {
		id,
		title: data.title || '',
		slug,
		excerpt: data.excerpt || '',
		content: data.content || '',
		coverImage: data.coverImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${slug}`,
		category: data.category || 'Tips',
		tags: data.tags || [],
		status: data.status || 'draft',
		author: data.author || 'Tim Miromi',
		publishedAt: data.status === 'published' ? new Date().toISOString().split('T')[0] : '',
		views: 0
	};
	list.unshift(item);
	return delay(item);
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
	const list = blogPosts();
	const idx = list.findIndex((p) => p.id === id);
	if (idx === -1) throw new Error('Post not found');
	list[idx] = { ...list[idx], ...data, id };
	return delay(list[idx]);
}

export async function deleteBlogPost(id: string): Promise<{ id: string }> {
	const list = blogPosts();
	const idx = list.findIndex((p) => p.id === id);
	if (idx !== -1) list.splice(idx, 1);
	return delay({ id });
}

// ═══════════════════════════════════════════════════════════════
//  Invoices
// ═══════════════════════════════════════════════════════════════

export async function getInvoices(): Promise<Invoice[]> {
	return delay([...invoices()]);
}
