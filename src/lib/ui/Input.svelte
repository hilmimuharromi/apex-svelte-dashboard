<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLInputAttributes & { class?: string; value?: string | number };
	let { class: cls, value = $bindable(), ...rest }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors',
		'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
		'disabled:cursor-not-allowed disabled:opacity-50',
		cls
	)}
	{...rest}
/>
