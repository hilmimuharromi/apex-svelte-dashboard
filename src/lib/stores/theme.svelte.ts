/**
 * Theme store — manages dark/light mode + accent color.
 *
 * Usage:
 *   import { theme } from '$lib/stores/theme.svelte';
 *   theme.toggle();          // dark ↔ light
 *   theme.setAccent('blue'); // change accent color
 *
 * On app init, call theme.init() (done in +layout.svelte).
 * The store mutates <html> class + CSS vars directly — no reload needed.
 */

export type AccentColor = 'emerald' | 'blue' | 'violet' | 'orange' | 'pink' | 'red';

const ACCENTS: Record<AccentColor, { primary: string; ring: string; name: string }> = {
	emerald: { primary: 'oklch(0.72 0.18 155)', ring: 'oklch(0.72 0.18 155)', name: 'Emerald' },
	blue:    { primary: 'oklch(0.62 0.19 250)', ring: 'oklch(0.62 0.19 250)', name: 'Blue' },
	violet:  { primary: 'oklch(0.62 0.22 295)', ring: 'oklch(0.62 0.22 295)', name: 'Violet' },
	orange:  { primary: 'oklch(0.73 0.17 55)',  ring: 'oklch(0.73 0.17 55)',  name: 'Orange' },
	pink:    { primary: 'oklch(0.65 0.24 350)', ring: 'oklch(0.65 0.24 350)', name: 'Pink' },
	red:     { primary: 'oklch(0.62 0.22 25)',  ring: 'oklch(0.62 0.22 25)',  name: 'Red' },
};

const STORAGE_KEY = 'apex-theme';

class ThemeStore {
	mode = $state<'light' | 'dark'>('light');
	accent = $state<AccentColor>('emerald');

	get isDark() {
		return this.mode === 'dark';
	}

	/** Call on app startup (in root +layout.svelte). */
	init() {
		if (typeof document === 'undefined') return;

		// Load saved prefs
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
			if (saved.mode) this.mode = saved.mode;
			if (saved.accent) this.accent = saved.accent;
		} catch { /* ignore */ }

		// Apply
		this.applyMode();
		this.applyAccent();
	}

	toggle() {
		this.mode = this.mode === 'light' ? 'dark' : 'light';
		this.applyMode();
		this.save();
	}

	setMode(mode: 'light' | 'dark') {
		this.mode = mode;
		this.applyMode();
		this.save();
	}

	setAccent(accent: AccentColor) {
		this.accent = accent;
		this.applyAccent();
		this.save();
	}

	get accentOptions() {
		return ACCENTS;
	}

	private applyMode() {
		if (typeof document === 'undefined') return;
		document.documentElement.classList.toggle('dark', this.mode === 'dark');
	}

	private applyAccent() {
		if (typeof document === 'undefined') return;
		const colors = ACCENTS[this.accent];
		const root = document.documentElement;
		root.style.setProperty('--color-primary', colors.primary);
		root.style.setProperty('--color-ring', colors.ring);
	}

	private save() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				mode: this.mode,
				accent: this.accent
			}));
		} catch { /* ignore */ }
	}
}

export const theme = new ThemeStore();
