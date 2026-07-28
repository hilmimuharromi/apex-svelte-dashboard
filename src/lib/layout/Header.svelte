<script lang="ts">
	import { Search, Bell, Sun, Moon, Palette, Plus } from '@lucide/svelte';
	import { APP_CONFIG } from '$lib/config';
	import { cn } from '$lib/utils';

	let { onOpenPalette, onToggleTheme, onOpenCustomizer } = $props<{
		onOpenPalette?: () => void;
		onToggleTheme?: () => void;
		onOpenCustomizer?: () => void;
	}>();

	let isDark = $state(false);

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		onToggleTheme?.();
	}
</script>

<header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-6">
	<!-- Search trigger -->
	<button
		onclick={() => onOpenPalette?.()}
		class="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors flex-1 max-w-md"
	>
		<Search class="h-4 w-4" />
		<span>Search...</span>
		<kbd class="ml-auto text-xs bg-background border border-border rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
	</button>

	<div class="ml-auto flex items-center gap-1">
		<button
			class="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
		>
			<Plus class="h-4 w-4" />
			<span class="hidden sm:inline">New Order</span>
		</button>

		<button
			onclick={toggleTheme}
			class="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
			aria-label="Toggle theme"
		>
			{#if isDark}
				<Sun class="h-4 w-4" />
			{:else}
				<Moon class="h-4 w-4" />
			{/if}
		</button>

		<button
			onclick={() => onOpenCustomizer?.()}
			class="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
			aria-label="Customize theme"
		>
			<Palette class="h-4 w-4" />
		</button>

		<button
			class="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
			aria-label="Notifications"
		>
			<Bell class="h-4 w-4" />
			<span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger"></span>
		</button>

		<button
			class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
			aria-label="User menu"
		>
			{APP_CONFIG.user.initials}
		</button>
	</div>
</header>
