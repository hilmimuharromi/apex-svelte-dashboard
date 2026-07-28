/**
 * Central brand & app config.
 * Fork this template → change values here → done.
 */
export const APP_CONFIG = {
	brand: {
		name: 'Miromi',
		suffix: 'KIDS CARE',
		full: 'Miromi Kids Care'
	},
	user: {
		name: 'Admin',
		role: 'Administrator',
		email: 'admin@miromi.id',
		initials: 'AD'
	},
	features: {
		commandPalette: true,
		themeCustomizer: true,
		i18n: false, // enabled in Phase 8
		notifications: true
	}
} as const;

export type AppConfig = typeof APP_CONFIG;
