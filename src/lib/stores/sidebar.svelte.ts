import { browser } from '$app/environment';

const STORAGE_KEY = 'apex:sidebar-collapsed';

class SidebarStore {
	collapsed = $state(false);
	mobileOpen = $state(false);

	constructor() {
		if (browser) {
			// hydrate from localStorage after mount to avoid SSR/client mismatch
			queueMicrotask(() => {
				const v = localStorage.getItem(STORAGE_KEY);
				if (v === '1') this.collapsed = true;
			});
		}
	}

	toggle() {
		this.collapsed = !this.collapsed;
		if (browser) localStorage.setItem(STORAGE_KEY, this.collapsed ? '1' : '0');
	}

	openMobile() {
		this.mobileOpen = true;
	}
	closeMobile() {
		this.mobileOpen = false;
	}
}

export const sidebar = new SidebarStore();
