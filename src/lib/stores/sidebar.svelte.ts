import { browser } from '$app/environment';

const STORAGE_KEY = 'apex:sidebar-collapsed';

function initial(): boolean {
	if (!browser) return false;
	const v = localStorage.getItem(STORAGE_KEY);
	return v === '1';
}

class SidebarStore {
	collapsed = $state(initial());
	mobileOpen = $state(false);

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
