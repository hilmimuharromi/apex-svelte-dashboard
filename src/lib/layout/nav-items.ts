import type { Component } from 'svelte';
import {
	LayoutDashboard,
	BarChart3,
	ShoppingCart,
	Package,
	UserCircle,
	FileText,
	Megaphone,
	Tag,
	BookOpen,
	Store,
	Cog,
	Bell,
	LifeBuoy,
	Blocks,
	Baby,
} from '@lucide/svelte';

export type NavItem = {
	label: string;
	href: string;
	icon: Component;
	badge?: string | number;
};

export type NavGroup = {
	label: string;
	items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
	{
		label: 'Overview',
		items: [
			{ label: 'Dashboard', href: '/', icon: LayoutDashboard },
			{ label: 'Analytics', href: '/analytics', icon: BarChart3 },
			{ label: 'Components', href: '/components', icon: Blocks }
		]
	},
	{
		label: 'Commerce',
		items: [
			{ label: 'Orders', href: '/orders', icon: ShoppingCart, badge: 12 },
			{ label: 'Products', href: '/products', icon: Package },
			{ label: 'Customers', href: '/customers', icon: UserCircle },
			{ label: 'Invoices', href: '/invoices', icon: FileText }
		]
	},
	{
		label: 'Marketing',
		items: [
			{ label: 'Banners', href: '/banners', icon: Megaphone },
			{ label: 'Promos', href: '/promos', icon: Tag },
			{ label: 'Blog', href: '/blog', icon: BookOpen }
		]
	},
	{
		label: 'System',
		items: [
			{ label: 'Settings', href: '/settings', icon: Cog },
			{ label: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
			{ label: 'Help & Support', href: '/help', icon: LifeBuoy },
			{ label: 'Documentation', href: '/docs', icon: BookOpen }
		]
	}
];
