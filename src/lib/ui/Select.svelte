<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { ChevronDown } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = HTMLSelectAttributes & {
		class?: string;
		value?: string;
		options?: { value: string; label: string }[];
		children?: import('svelte').Snippet;
	};

	let { class: cls, value = $bindable(), options, children, ...rest }: Props = $props();
</script>

<div class="relative">
	<select
		bind:value
		class={cn(
			'flex h-9 w-full appearance-none rounded-lg border border-input bg-background pl-3 pr-9 py-1.5 text-sm shadow-sm',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
			'disabled:cursor-not-allowed disabled:opacity-50',
			cls
		)}
		{...rest}
	>
		{#if options}
			{#each options as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		{/if}
		{@render children?.()}
	</select>
	<ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
</div>
