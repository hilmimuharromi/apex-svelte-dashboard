<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Check } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = Omit<HTMLInputAttributes, 'type'> & { class?: string; checked?: boolean };
	let { class: cls, checked = $bindable(false), ...rest }: Props = $props();
</script>

<label class="inline-flex items-center gap-2 cursor-pointer">
	<span
		class={cn(
			'inline-flex h-4 w-4 items-center justify-center rounded border transition-colors',
			checked ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background',
			cls
		)}
	>
		{#if checked}<Check class="h-3 w-3" />{/if}
	</span>
	<input type="checkbox" bind:checked class="sr-only" {...rest} />
</label>
