<script lang="ts">
	import type { Component } from 'svelte';
	import { ArrowUp, ArrowDown } from '@lucide/svelte';
	import { pct } from '$lib/utils';
	import { cn } from '$lib/utils';

	type Props = {
		label: string;
		value: string | number;
		delta?: number;
		deltaLabel?: string;
		icon?: Component;
		invert?: boolean;
		class?: string;
	};

	let { label, value, delta, deltaLabel = 'vs last month', icon: Icon, invert = false, class: cls }: Props = $props();
	const up = $derived(delta != null && delta >= 0);
	const positive = $derived(invert ? !up : up);
</script>

<div class={cn('rounded-xl border border-border bg-card p-5 shadow-sm', cls)}>
	<div class="flex items-start justify-between">
		<p class="text-sm text-muted-foreground">{label}</p>
		{#if Icon}
			<div class="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
				<Icon class="h-4 w-4 text-muted-foreground" />
			</div>
		{/if}
	</div>
	<p class="mt-3 text-2xl font-semibold tabular">{value}</p>
	{#if delta != null}
		<div class="mt-2 flex items-center gap-1 text-xs">
			<span class="inline-flex items-center gap-0.5 font-medium {positive ? 'text-success' : 'text-danger'}">
				{#if up}
					<ArrowUp class="h-3 w-3" />
				{:else}
					<ArrowDown class="h-3 w-3" />
				{/if}
				{pct(delta)}
			</span>
			<span class="text-muted-foreground">{deltaLabel}</span>
		</div>
	{/if}
</div>
