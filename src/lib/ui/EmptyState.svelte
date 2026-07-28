<script lang="ts">
	import type { Component } from 'svelte';
	import { cn } from '$lib/utils';
	import { Inbox } from '@lucide/svelte';

	type Props = {
		icon?: Component;
		title?: string;
		description?: string;
		class?: string;
		action?: import('svelte').Snippet;
	};

	let { icon: Icon = Inbox, title = 'Nothing here yet', description, class: cls, action }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center py-16 text-center', cls)}>
	<div class="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
		<Icon class="h-6 w-6 text-muted-foreground" />
	</div>
	<p class="font-medium">{title}</p>
	{#if description}
		<p class="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
	{/if}
	{#if action}
		<div class="mt-4">{@render action()}</div>
	{/if}
</div>
