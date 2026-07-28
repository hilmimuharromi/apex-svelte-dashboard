/**
 * Central brand & app config.
 * Fork this template → change values here → done.
 */
export const APP_CONFIG = {
	brand: {
		name: 'Apex',
		suffix: 'DASHBOARD',
		full: 'Apex Dashboard'
	},
	// User visible in header/sidebar (placeholder — replace with real session)
	user: {
		name: 'Aigars S.',
		role: 'Admin',
		email: 'admin@apex.local',
		initials: 'AS'
	},
	features: {
		commandPalette: true,
		themeCustomizer: true,
		i18n: false, // enabled in Phase 8
		notifications: true
	}
} as const;

export type AppConfig = typeof APP_CONFIG;
