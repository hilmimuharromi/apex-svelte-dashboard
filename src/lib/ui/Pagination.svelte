<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		page: number;
		total: number;
		pageSize?: number;
		onChange: (page: number) => void;
		class?: string;
	};

	let { page = $bindable(), total, pageSize = 10, onChange, class: cls }: Props = $props();
	const totalPages = $derived(Math.max(1, Math.ceil(total / pageSize)));

	function go(p: number) {
		const next = Math.max(1, Math.min(totalPages, p));
		if (next !== page) {
			page = next;
			onChange(next);
		}
	}

	const pages = $derived.by(() => {
		const arr: (number | '...')[] = [];
		const push = (v: number | '...') => arr.push(v);
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) push(i);
			return arr;
		}
		push(1);
		if (page > 3) push('...');
		for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) push(i);
		if (page < totalPages - 2) push('...');
		push(totalPages);
		return arr;
	});
</script>

<div class={cn('flex items-center gap-1', cls)}>
	<button
		class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted disabled:opacity-40"
		disabled={page <= 1}
		onclick={() => go(page - 1)}
		aria-label="Previous page"
	>
		<ChevronLeft class="h-4 w-4" />
	</button>
	{#each pages as p}
		{#if p === '...'}
			<span class="px-2 text-muted-foreground">…</span>
		{:else}
			<button
				class={cn(
					'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm',
					p === page
						? 'bg-primary text-primary-foreground border-primary'
						: 'border-border hover:bg-muted'
				)}
				onclick={() => go(p as number)}
			>
				{p}
			</button>
		{/if}
	{/each}
	<button
		class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted disabled:opacity-40"
		disabled={page >= totalPages}
		onclick={() => go(page + 1)}
		aria-label="Next page"
	>
		<ChevronRight class="h-4 w-4" />
	</button>
</div>
