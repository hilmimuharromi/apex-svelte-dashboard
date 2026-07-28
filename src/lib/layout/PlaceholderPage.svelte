<script lang="ts">
	import { Card } from '$lib/ui';
	import { Sparkles } from '@lucide/svelte';

	type Props = { title: string; description?: string };
	let { title, description }: Props = $props();
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">{title}</h1>
		{#if description}
			<p class="mt-1 text-sm text-muted-foreground">{description}</p>
		{/if}
	</div>

	<Card>
		<div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
			<div class="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
				<Sparkles class="h-6 w-6" />
			</div>
			<h2 class="text-lg font-semibold">Coming soon</h2>
			<p class="max-w-md text-sm text-muted-foreground">
				This page is scaffolded and reserved. Full implementation lands in a later phase.
			</p>
		</div>
	</Card>
</div>
