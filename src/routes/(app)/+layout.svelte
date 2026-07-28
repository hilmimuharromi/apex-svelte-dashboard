<script lang="ts">
	import Sidebar from '$lib/layout/Sidebar.svelte';
	import Header from '$lib/layout/Header.svelte';
	import { Toaster } from '$lib/ui';

	let { children } = $props();
</script>

<div class="flex min-h-screen bg-background">
	<Sidebar />
	<div class="flex-1 flex flex-col min-w-0">
		<Header />
		<main class="flex-1 p-6 overflow-x-hidden">
			{@render children()}
			</main>
			<Toaster />
	</div>
</div>
