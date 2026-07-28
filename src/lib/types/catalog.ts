/** ═══════════════════════════════════════════════════════
 *  Catalog Types — Personal Care E-Commerce
 *  ═══════════════════════════════════════════════════════ */

export type ProductVariant = {
	id: string;
	name: string;       // "50ml", "100ml", "Refill"
	sku: string;
	price: number;
	stock: number;
};

export type Product = {
	id: string;
	name: string;
	slug: string;
	category: string;
	shortDescription: string;
	description: string;       // rich HTML
	images: string[];          // gallery — multiple
	status: 'Active' | 'Draft' | 'Archived';
	variants: ProductVariant[];
	ingredients: string;
	bpomNumber: string;
	ageRange: string;          // "0-6 bln", "6-12 bln", "1-3 thn", "3+ thn", "All Ages"
	skinType: string[];        // ["Sensitive", "Normal", "Dry", "Oily"]
	price: number;             // starting price
	stock: number;             // total across variants
	sales: number;
	rating: number;
	reviews: number;
	createdAt: string;
};

/** ═══════════════════════════════════════════════════════
 *  Order Types
 *  ═══════════════════════════════════════════════════════ */

export type OrderStatus =
	| 'pending'      // menunggu pembayaran
	| 'paid'         // pembayaran diterima
	| 'packing'      // sedang dikemas
	| 'shipped'      // dikirim
	| 'delivered'    // sampai
	| 'cancelled'    // dibatalkan
	| 'returned';    // retur

export type OrderItem = {
	productId: string;
	productName: string;
	variantName?: string;
	image: string;
	qty: number;
	price: number;
};

export type Order = {
	id: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	items: OrderItem[];
	subtotal: number;
	shippingCost: number;
	discount: number;
	total: number;
	status: OrderStatus;
	paymentMethod: string;     // "QRIS", "VA BCA", "GoPay", etc
	courier: string;           // "JNE", "SiCepat", "J&T"
	trackingNumber: string;
	shippingAddress: string;
	note: string;
	createdAt: string;
};

/** ═══════════════════════════════════════════════════════
 *  Customer Types
 *  ═══════════════════════════════════════════════════════ */

export type ChildProfile = {
	id: string;
	name: string;
	birthDate: string;
	gender: 'L' | 'P';
	skinType: string;          // "Sensitive", "Normal", "Dry"
	allergies: string;         // comma-separated
};

export type Customer = {
	id: string;
	name: string;
	email: string;
	phone: string;
	initials: string;
	avatar: string;
	totalOrders: number;
	totalSpent: number;
	membership: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
	points: number;
	children: ChildProfile[];
	joinedAt: string;
	lastOrderAt: string;
};

/** ═══════════════════════════════════════════════════════
 *  Marketing Types
 *  ═══════════════════════════════════════════════════════ */

export type Banner = {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	link: string;              // mobile app deep link
	position: 'home_top' | 'home_mid' | 'category';
	status: 'active' | 'inactive';
	sortOrder: number;
	startDate: string;
	endDate: string;
};

export type Promo = {
	id: string;
	code: string;
	title: string;
	type: 'percentage' | 'fixed' | 'bogo';   // buy one get one
	value: number;             // percentage (10) or fixed (15000)
	minPurchase: number;
	maxUsage: number;
	usedCount: number;
	startDate: string;
	endDate: string;
	status: 'active' | 'scheduled' | 'expired';
};

/** ═══════════════════════════════════════════════════════
 *  Content Types
 *  ═══════════════════════════════════════════════════════ */

export type BlogPost = {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;           // rich HTML
	coverImage: string;
	category: string;
	tags: string[];
	status: 'published' | 'draft';
	author: string;
	publishedAt: string;
	views: number;
};

/** ═══════════════════════════════════════════════════════
 *  Store Settings Types
 *  ═══════════════════════════════════════════════════════ */

export type StoreSettings = {
	storeName: string;
	logo: string;
	tagline: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	postalCode: string;
};

export type ShippingRate = {
	courier: string;
	service: string;
	region: string;
	cost: number;
	etd: string;               // "2-3 hari"
};

export type PaymentConfig = {
	method: string;            // "QRIS", "VA BCA", "GoPay"
	displayName: string;
	isActive: boolean;
	feeType: 'fixed' | 'percentage';
	feeValue: number;
};
