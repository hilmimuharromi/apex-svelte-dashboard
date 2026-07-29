<script lang="ts">
	import Sidebar from '$lib/layout/Sidebar.svelte';
	import Header from '$lib/layout/Header.svelte';
	import ThemeCustomizer from '$lib/layout/ThemeCustomizer.svelte';
	import { Toaster } from '$lib/ui';
	import { theme } from '$lib/stores/theme.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	// Init theme on mount (client-only)
	$effect(() => {
		theme.init();
	});

	// Keep client-side auth store in sync with server data
	$effect(() => {
		auth.sync(page.data.user);
	});

	let customizerOpen = $state(false);
</script>

<div class="flex min-h-screen bg-background">
	<Sidebar />
	<div class="flex-1 flex flex-col min-w-0">
		<Header
			onToggleTheme={() => theme.toggle()}
			onOpenCustomizer={() => (customizerOpen = true)}
		/>
		<main class="flex-1 p-6 overflow-x-hidden">
			{@render children()}
		</main>
		<Toaster />
	</div>
</div>

<ThemeCustomizer bind:open={customizerOpen} />
