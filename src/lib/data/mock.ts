import type {
	Product, Order, Customer, Banner, Promo, BlogPost,
	OrderStatus, OrderItem, ChildProfile
} from '$lib/types/catalog';

// ── Helpers ──────────────────────────────────────────────────────────────
function rng(seed: number) {
	let s = seed;
	return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

const NAMES = [
	['Emma', 'Wilson'], ['James', 'Chen'], ['Sofia', 'Garcia'], ['Alex', 'Thompson'],
	['Maria', 'Santos'], ['David', 'Kim'], ['Sarah', 'Johnson'], ['Marcus', 'Brown'],
	['Priya', 'Patel'], ['Liam', 'O\'Brien'], ['Yuki', 'Tanaka'], ['Nina', 'Rossi'],
	['Carlos', 'Mendez'], ['Fatima', 'Al-Hassan'], ['Jack', 'Williams'],
	['Anya', 'Petrov'], ['Omar', 'Khalid'], ['Ingrid', 'Berg'], ['Kofi', 'Asante'],
	['Mei', 'Lin'], ['Rafael', 'Costa'], ['Zara', 'Ahmed'], ['Ethan', 'Clarke'],
	['Amara', 'Diallo'], ['Lucas', 'Moura']
];

// ═════════════════════════════════════════════════════════════════════════
//  PRODUCTS — Personal Care Anak
// ═════════════════════════════════════════════════════════════════════════

const PRODUCT_DATA = [
	{ name: 'Sunscreen Anak SPF50+', cat: 'Sunscreen', price: 89000, ages: '6 bln+', skin: ['Sensitive', 'Normal'], bpom: 'BPOM NA182910001',
	  img: 'sunscreen', desc: '<p>Sunscreen khusus anak dengan SPF50+ PA++++, perlindungan maksimal dari sinar UVA & UVB.</p><ul><li>Mineral based (Zinc Oxide)</li><li>Tanpa parfum & alkohol</li><li>Water resistant 80 menit</li><li>Cruelty free & vegan</li></ul>' },
	{ name: 'Body Lotion pelembab', cat: 'Lotion', price: 65000, ages: '0 bln+', skin: ['Dry', 'Sensitive'], bpom: 'BPOM NA15289002',
	  img: 'lotion', desc: '<p>Pelembab harian untuk kulit bayi & anak, menjaga kelembutan kulit sepanjang hari.</p><ul><li>Ekstrak oatmeal & shea butter</li><li>Hipoalergenik</li><li>Tanpa paraben</li><li>Dermatologically tested</li></ul>' },
	{ name: 'Baby Wash Sabun Mandi', cat: 'Sabun', price: 55000, ages: '0 bln+', skin: ['Sensitive', 'Normal', 'Dry'], bpom: 'BPOM NA16229003',
	  img: 'wash', desc: '<p>Sabun mandi lembut dengan pH 5.5 seimbang, aman untuk bayi baru.</p><ul><li>Tanpa SLS & SLES</li><li>Ekstrak chamomile</li><li>Tidak perih di mata</li></ul>' },
	{ name: 'Diaper Cream', cat: 'Krim', price: 72000, ages: '0 bln+', skin: ['Sensitive', 'Dry'], bpom: 'BPOM NA182910004',
	  img: 'cream', desc: '<p>Krim ruam popok dengan zinc oxide untuk mencegah & menyembuhkan diaper rash.</p><ul><li>15% Zinc Oxide</li><li>Ekstrak lidah buaya</li><li>Barrier pelindung kulit</li></ul>' },
	{ name: 'Hair Conditioner Anak', cat: 'Rambut', price: 48000, ages: '1 thn+', skin: ['Normal', 'Dry'], bpom: 'BPOM NA15289005',
	  img: 'conditioner', desc: '<p>Conditioner rambut anak yang melepaskan kusut dengan mudah, wangi alami.</p><ul><li>Ekstrak argan oil</li><li>Tanpa silicone</li><li>Mudah dibilas</li></ul>' },
	{ name: 'Face Cream Anak', cat: 'Krim', price: 78000, ages: '3 thn+', skin: ['Sensitive', 'Normal', 'Dry', 'Oily'], bpom: 'BPOM NA16229006',
	  img: 'face-cream', desc: '<p>Pelembab wajah ringan untuk anak, melindungi dari polusi & UV harian.</p><ul><li>SPF15 PA++</li><li>Ekstrak centella asiatica</li><li>Oil-free formula</li></ul>' },
	{ name: 'Shampoo Anti-Ketombe', cat: 'Rambut', price: 52000, ages: '3 thn+', skin: ['Normal', 'Oily'], bpom: 'BPOM NA182910007',
	  img: 'shampoo', desc: '<p>Shampoo khusus anak dengan masalah kulit kepala, mengatasi gatal & ketombe.</p><ul><li>Ekstrak tea tree oil</li><li>Tanpa parfum sintetis</li><li>pH balanced</li></ul>' },
	{ name: 'Mosquito Repellent Lotion', cat: 'Lotion', price: 45000, ages: '6 bln+', skin: ['Sensitive', 'Normal'], bpom: 'BPOM NA15289008',
	  img: 'repellent', desc: '<p>Lotion anti-nyamuk aman untuk anak, melindungi hingga 8 jam.</p><ul><li>Picaridin 10%</li><li>Tanpa DEET</li><li>Non-greasy formula</li></ul>' },
];

const VARIANTS = [
	[{ name: '50ml', sku: '-050', priceDelta: 0 }, { name: '100ml', sku: '-100', priceDelta: 30000 }],
	[{ name: '100ml', sku: '-100', priceDelta: 0 }, { name: '200ml', sku: '-200', priceDelta: 25000 }, { name: 'Refill 200ml', sku: '-200R', priceDelta: 15000 }],
	[{ name: '250ml', sku: '-250', priceDelta: 0 }, { name: '500ml', sku: '-500', priceDelta: 25000 }],
	[{ name: '30g', sku: '-030', priceDelta: 0 }, { name: '60g', sku: '-060', priceDelta: 20000 }],
	[{ name: '150ml', sku: '-150', priceDelta: 0 }],
	[{ name: '30ml', sku: '-030', priceDelta: 0 }, { name: '50ml', sku: '-050', priceDelta: 25000 }],
	[{ name: '200ml', sku: '-200', priceDelta: 0 }, { name: '400ml', sku: '-400', priceDelta: 20000 }],
	[{ name: '100ml', sku: '-100', priceDelta: 0 }],
];

const STATUS_WEIGHTS: Product['status'][] = ['Active', 'Active', 'Active', 'Active', 'Draft', 'Archived'];

export function generateProducts(n = 24): Product[] {
	const r = rng(42);
	const colors = ['10b981', '3b82f6', '8b5cf6', 'f59e0b', 'ec4899', 'ef4444', '06b6d4', '84cc16'];
	return Array.from({ length: Math.min(n, PRODUCT_DATA.length * 4) }, (_, i) => {
		const pd = PRODUCT_DATA[i % PRODUCT_DATA.length];
		const vi = i % PRODUCT_DATA.length;
		const variants = VARIANTS[vi].map((v, j) => ({
			id: `${pd.img}-v${j}`,
			name: v.name,
			sku: `SKU-${pd.img.toUpperCase()}${v.sku}`,
			price: pd.price + v.priceDelta,
			stock: Math.floor(r() * 300) + 20,
		}));
		const ver = i >= PRODUCT_DATA.length ? ` v${Math.floor(i / PRODUCT_DATA.length) + 1}` : '';
		return {
			id: `PRD-${String(i + 1).padStart(3, '0')}`,
			name: pd.name + ver,
			slug: pd.img + (ver ? `-${i}` : ''),
			category: pd.cat,
			shortDescription: pd.desc.replace(/<[^>]+>/g, '').slice(0, 80) + '...',
			description: pd.desc,
			images: Array.from({ length: 3 }, (_, k) =>
				`https://api.dicebear.com/7.x/shapes/svg?seed=${pd.img}-${i}-${k}&backgroundColor=${colors[i % colors.length]}`
			),
			status: STATUS_WEIGHTS[Math.floor(r() * STATUS_WEIGHTS.length)],
			variants,
			ingredients: 'Aqua, Zinc Oxide, Caprylic/Capric Triglyceride, Cetearyl Alcohol, Glyceryl Stearate, Glycerin, Allantoin, Tocopheryl Acetate, Xanthan Gum, Citric Acid.',
			bpomNumber: pd.bpom,
			ageRange: pd.ages,
			skinType: pd.skin,
			price: pd.price,
			stock: variants.reduce((s, v) => s + v.stock, 0),
			sales: Math.floor(r() * 500) + 10,
			rating: Math.round((3.5 + r() * 1.5) * 10) / 10,
			reviews: Math.floor(r() * 200) + 5,
			createdAt: new Date(2025, Math.floor(r() * 12), Math.floor(r() * 28) + 1).toISOString(),
		};
	});
}

// ═════════════════════════════════════════════════════════════════════════
//  ORDERS
// ═════════════════════════════════════════════════════════════════════════

const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'packing', 'shipped', 'delivered', 'cancelled', 'returned'];
const PAYMENT_METHODS = ['QRIS', 'VA BCA', 'VA Mandiri', 'GoPay', 'OVO', 'Dana', 'ShopeePay'];
const COURIERS = ['JNE REG', 'JNE YES', 'SiCepat REG', 'SiCepat BEST', 'J&T EZ', 'AnterAja REG', 'Paxel'];
const CITIES = ['Jakarta Selatan', 'Bandung', 'Surabaya', 'Bekasi', 'Tangerang', 'Depok', 'Semarang', 'Medan', 'Bogor', 'Yogyakarta'];

export function generateOrders(n = 50): Order[] {
	const r = rng(77);
	const prods = generateProducts();
	return Array.from({ length: n }, (_, i) => {
		const [first, last] = NAMES[i % NAMES.length];
		const itemCount = Math.floor(r() * 3) + 1;
		const items: OrderItem[] = Array.from({ length: itemCount }, (_, j) => {
			const p = prods[Math.floor(r() * prods.length)];
			const v = p.variants[Math.floor(r() * p.variants.length)];
			return {
				productId: p.id,
				productName: p.name,
				variantName: v.name,
				image: p.images[0],
				qty: Math.floor(r() * 3) + 1,
				price: v.price,
			};
		});
		const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
		const shippingCost = 9000 + Math.floor(r() * 12) * 1000;
		const discount = r() > 0.7 ? Math.floor(subtotal * 0.1) : 0;
		const status = ORDER_STATUSES[Math.floor(r() * ORDER_STATUSES.length)];
		const date = new Date(2026, 6, Math.floor(r() * 28) + 1);
		return {
			id: `ORD-${10000 + i}`,
			customerName: `${first} ${last}`,
			customerEmail: `${first.toLowerCase()}@example.com`,
			customerPhone: `08${Math.floor(r() * 9 + 1)}${String(Math.floor(r() * 100000000)).padStart(8, '0')}`,
			items,
			subtotal,
			shippingCost,
			discount,
			total: subtotal + shippingCost - discount,
			status,
			paymentMethod: PAYMENT_METHODS[Math.floor(r() * PAYMENT_METHODS.length)],
			courier: COURIERS[Math.floor(r() * COURIERS.length)],
			trackingNumber: status === 'shipped' || status === 'delivered'
				? `${['JNE', 'SCP', 'JNT', 'ATA'][Math.floor(r() * 4)]}${String(Math.floor(r() * 90000000) + 10000000)}`
				: '',
			shippingAddress: `Jl. ${['Mawar', 'Melati', 'Anggrek', 'Cempaka', 'Kenanga'][Math.floor(r() * 5)]} No. ${Math.floor(r() * 100) + 1}, ${CITIES[Math.floor(r() * CITIES.length)]}`,
			note: r() > 0.8 ? 'Tolong kemas dengan aman, untuk hadiah' : '',
			createdAt: date.toISOString(),
		};
	});
}

// Legacy order generators removed — all pages now use the new Order type

// ═════════════════════════════════════════════════════════════════════════
//  CUSTOMERS with Child Profiles
// ═════════════════════════════════════════════════════════════════════════

export function generateCustomers(n = 30): Customer[] {
	const r = rng(55);
	const memberships: Customer['membership'][] = ['Bronze', 'Bronze', 'Silver', 'Silver', 'Gold', 'Platinum'];
	const skinTypes = ['Sensitive', 'Normal', 'Dry', 'Oily'];
	const childNames = ['Aisha', 'Bima', 'Cinta', 'Dimas', 'Elina', 'Farhan', 'Gita', 'Hana', 'Ian', 'Jihan'];
	return NAMES.slice(0, n).map(([first, last], i) => {
		const childCount = Math.floor(r() * 3) + 1;
		const children: ChildProfile[] = Array.from({ length: childCount }, (_, j) => ({
			id: `CHD-${i}${j}`,
			name: childNames[Math.floor(r() * childNames.length)],
			birthDate: new Date(2022 + Math.floor(r() * 4), Math.floor(r() * 12), Math.floor(r() * 28) + 1).toISOString(),
			gender: r() > 0.5 ? 'L' : 'P' as const,
			skinType: skinTypes[Math.floor(r() * skinTypes.length)],
			allergies: r() > 0.7 ? 'Fragrance' : (r() > 0.8 ? 'Aloe Vera' : 'Tidak ada'),
		}));
		const totalOrders = Math.floor(r() * 30) + 1;
		const totalSpent = totalOrders * (50000 + Math.floor(r() * 150000));
		return {
			id: `CUS-${String(i + 1).padStart(4, '0')}`,
			name: `${first} ${last}`,
			email: `${first.toLowerCase()}@example.com`,
			phone: `08${Math.floor(r() * 9 + 1)}${String(Math.floor(r() * 100000000)).padStart(8, '0')}`,
			initials: `${first[0]}${last[0]}`,
			avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${first}+${last}`,
			totalOrders,
			totalSpent,
			membership: memberships[Math.floor(r() * memberships.length)],
			points: Math.floor(totalSpent / 10000),
			children,
			joinedAt: new Date(2024, Math.floor(r() * 12), Math.floor(r() * 28) + 1).toISOString(),
			lastOrderAt: new Date(2026, 6, Math.floor(r() * 28) + 1).toISOString(),
		};
	});
}

// ═════════════════════════════════════════════════════════════════════════
//  BANNERS
// ═════════════════════════════════════════════════════════════════════════

export function generateBanners(): Banner[] {
	return [
		{ id: 'BNR-001', title: 'Promo Back to School', subtitle: 'Diskon 20% semua produk skincare anak', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=banner1&backgroundColor=10b981', link: '/promo/back-to-school', position: 'home_top', status: 'active', sortOrder: 1, startDate: '2026-07-01', endDate: '2026-08-31' },
		{ id: 'BNR-002', title: 'Bundle Hemat Keluarga', subtitle: 'Beli 3 lebih murah — sunscreen + lotion + wash', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=banner2&backgroundColor=3b82f6', link: '/promo/bundle', position: 'home_top', status: 'active', sortOrder: 2, startDate: '2026-06-15', endDate: '2026-12-31' },
		{ id: 'BNR-003', title: 'Tips Merawat Kulit Bayi', subtitle: 'Baca panduan lengkap dari dokter kulit anak', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=banner3&backgroundColor=8b5cf6', link: '/blog/tips-kulit-bayi', position: 'home_mid', status: 'active', sortOrder: 3, startDate: '2026-01-01', endDate: '2026-12-31' },
		{ id: 'BNR-004', title: 'New Arrival: Face Cream Anak', subtitle: 'SPF15 PA++ dengan centella asiatica', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=banner4&backgroundColor=f59e0b', link: '/product/face-cream', position: 'category', status: 'inactive', sortOrder: 4, startDate: '2026-07-15', endDate: '2026-09-15' },
	];
}

// ═════════════════════════════════════════════════════════════════════════
//  PROMOS
// ═════════════════════════════════════════════════════════════════════════

export function generatePromos(): Promo[] {
	return [
		{ id: 'PRM-001', code: 'HEMAT10', title: 'Diskon 10% Seluruh Produk', type: 'percentage', value: 10, minPurchase: 100000, maxUsage: 500, usedCount: 312, startDate: '2026-07-01', endDate: '2026-08-31', status: 'active' },
		{ id: 'PRM-002', code: 'FREESHIP', title: 'Gratis Ongkir Min. Belanja 150K', type: 'fixed', value: 20000, minPurchase: 150000, maxUsage: 1000, usedCount: 778, startDate: '2026-06-01', endDate: '2026-12-31', status: 'active' },
		{ id: 'PRM-003', code: 'BOGO_SUN', title: 'Beli 1 Gratis 1 Sunscreen', type: 'bogo', value: 1, minPurchase: 89000, maxUsage: 100, usedCount: 45, startDate: '2026-07-15', endDate: '2026-07-30', status: 'active' },
		{ id: 'PRM-004', code: 'NEWBIE25', title: 'Diskon 25% Member Baru', type: 'percentage', value: 25, minPurchase: 50000, maxUsage: 200, usedCount: 200, startDate: '2026-06-01', endDate: '2026-07-15', status: 'expired' },
		{ id: 'PRM-005', code: 'FLASH50', title: 'Flash Sale 50% — Khusus Hari Ini', type: 'percentage', value: 50, minPurchase: 0, maxUsage: 300, usedCount: 0, startDate: '2026-08-01', endDate: '2026-08-01', status: 'scheduled' },
	];
}

// ═════════════════════════════════════════════════════════════════════════
//  BLOG POSTS
// ═════════════════════════════════════════════════════════════════════════

export function generateBlogPosts(): BlogPost[] {
	return [
		{ id: 'BLG-001', title: '7 Tips Memilih Sunscreen untuk Anak', slug: 'tips-sunscreen-anak', excerpt: 'Sunscreen penting untuk anak, tapi tidak semua produk aman. Ini panduannya.', content: '<p>Memilih sunscreen untuk anak perlu perhatian khusus...</p><h2>1. Pilih Mineral Sunscreen</h2><p>Zinc oxide lebih aman untuk kulit anak karena tidak menyerap ke dalam kulit.</p><h2>2. Cek SPF</h2><p>Minimal SPF30, idealnya SPF50+ untuk aktivitas outdoor.</p>', coverImage: 'https://api.dicebear.com/7.x/shapes/svg?seed=blog1&backgroundColor=10b981', category: 'Tips', tags: ['sunscreen', 'skincare', 'outdoor'], status: 'published', author: 'Dr. Sarah, Sp.A', publishedAt: '2026-07-20', views: 1520 },
		{ id: 'BLG-002', title: 'Cara Mengatasi Diaper Rash dengan Benar', slug: 'diaper-rash-tips', excerpt: 'Ruam popok adalah masalah umum. Ini langkah-langkah penanganannya.', content: '<p>Diaper rash atau ruam popok adalah iritasi kulit yang umum terjadi pada bayi...</p><h2>Pencegahan</h2><ul><li>Ganti popok secara teratur</li><li>Bersihkan dengan air hangat</li><li>Biarkan kering sebelum memasang popok baru</li></ul>', coverImage: 'https://api.dicebear.com/7.x/shapes/svg?seed=blog2&backgroundColor=ef4444', category: 'Parenting', tags: ['diaper-rash', 'bayi', 'kulit'], status: 'published', author: 'Dr. James, Sp.A', publishedAt: '2026-07-15', views: 2340 },
		{ id: 'BLG-003', title: 'Bahan Aktif Skincare Anak yang Wajib Diketahui', slug: 'bahan-aktif-skincare-anak', excerpt: 'Tidak semua bahan skincare dewasa aman untuk anak. Pelajari bahan yang aman.', content: '<p>Kulit anak lebih tipis dan sensitif dibanding dewasa...</p><h2>Bahan Aman</h2><ul><li>Centella Asiatica</li><li>Oatmeal</li><li>Shea Butter</li></ul><h2>Bahan yang Dihindari</h2><ul><li>Retinol</li><li>AHA/BHA konsentrasi tinggi</li><li>Parfum sintetis</li></ul>', coverImage: 'https://api.dicebear.com/7.x/shapes/svg?seed=blog3&backgroundColor=8b5cf6', category: 'Edukasi', tags: ['ingredients', 'skincare', 'safety'], status: 'published', author: 'Dr. Sarah, Sp.A', publishedAt: '2026-07-10', views: 890 },
		{ id: 'BLG-004', title: 'Routine Skincare Pagi untuk Anak Sekolah', slug: 'morning-routine-anak', excerpt: 'Persiapan kulit anak sebelum berangkat sekolah.', content: '<p>Routine sederhana untuk melindungi kulit anak sepanjang hari...</p>', coverImage: 'https://api.dicebear.com/7.x/shapes/svg?seed=blog4&backgroundColor=3b82f6', category: 'Tips', tags: ['routine', 'skincare', 'sekolah'], status: 'draft', author: 'Tim Miromi', publishedAt: '', views: 0 },
	];
}
