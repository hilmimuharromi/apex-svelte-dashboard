<script lang="ts">
	import { cn } from '$lib/utils';
	import Label from './Label.svelte';

	type Props = {
		label?: string;
		description?: string;
		error?: string;
		required?: boolean;
		class?: string;
		children: import('svelte').Snippet;
	};

	let { label, description, error, required, class: cls, children }: Props = $props();
</script>

<div class={cn('space-y-1.5', cls)}>
	{#if label}
		<Label>
			{label}
			{#if required}<span class="text-danger">*</span>{/if}
		</Label>
	{/if}
	{@render children()}
	{#if error}
		<p class="text-xs text-danger">{error}</p>
	{:else if description}
		<p class="text-xs text-muted-foreground">{description}</p>
	{/if}
</div>
