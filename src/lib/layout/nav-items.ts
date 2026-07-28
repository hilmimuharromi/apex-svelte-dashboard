import type { Component } from 'svelte';
import {
	LayoutDashboard,
	BarChart3,
	ShoppingBag,
	Users,
	Sparkles,
	LineChart,
	ShoppingCart,
	Package,
	UserCircle,
	FileText,
	Mail,
	MessageSquare,
	FolderKanban,
	KanbanSquare,
	Calendar,
	Wand2,
	ClipboardList,
	CreditCard,
	UserCog,
	Bell,
	Settings,
	LifeBuoy,
	BookOpen,
	Blocks
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
			{ label: 'eCommerce', href: '/ecommerce', icon: ShoppingBag },
			{ label: 'CRM', href: '/crm', icon: Users },
			{ label: 'SaaS', href: '/saas', icon: Sparkles },
			{ label: 'Charts', href: '/charts', icon: LineChart },
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
		label: 'Apps',
		items: [
			{ label: 'Mail', href: '/mail', icon: Mail },
			{ label: 'Chat', href: '/chat', icon: MessageSquare },
			{ label: 'Files', href: '/files', icon: FolderKanban },
			{ label: 'Kanban', href: '/kanban', icon: KanbanSquare },
			{ label: 'Calendar', href: '/calendar', icon: Calendar },
			{ label: 'Wizard', href: '/wizard', icon: Wand2 },
			{ label: 'Forms', href: '/forms', icon: ClipboardList }
		]
	},
	{
		label: 'Finance',
		items: [{ label: 'Billing', href: '/billing', icon: CreditCard }]
	},
	{
		label: 'System',
		items: [
			{ label: 'Users', href: '/users', icon: UserCog },
			{ label: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
			{ label: 'Settings', href: '/settings', icon: Settings },
			{ label: 'Help & Support', href: '/help', icon: LifeBuoy },
			{ label: 'Documentation', href: '/docs', icon: BookOpen }
		]
	}
];
