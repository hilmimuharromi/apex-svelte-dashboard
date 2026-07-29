/**
 * Client-side auth store — reactive user state for components.
 *
 * On mount, syncs from SvelteKit page data (populated by +layout.server.ts).
 * Use this when a component needs to react to login/logout without a full
 * page reload.
 *
 * Usage:
 *   import { auth } from '$lib/stores/auth.svelte';
 *   auth.user          // current user or null
 *   auth.isAuthenticated // boolean
 *   auth.isAdmin       // role-based check
 *
 * Call auth.sync(user) from +layout.svelte $effect to keep it in sync.
 */

import type { User } from '$lib/types/auth';

class AuthStore {
	user = $state<User | null>(null);

	get isAuthenticated() {
		return this.user !== null;
	}

	get isAdmin() {
		return this.user?.role?.toLowerCase().includes('admin') ?? false;
	}

	get initials() {
		if (!this.user?.name) return '?';
		return this.user.name
			.split(' ')
			.map((n) => n[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}

	/** Sync from page data (call in root +layout.svelte $effect). */
	sync(user: User | null) {
		this.user = user;
	}

	/** Clear on logout (for client-side immediate feedback). */
	clear() {
		this.user = null;
	}
}

export const auth = new AuthStore();
