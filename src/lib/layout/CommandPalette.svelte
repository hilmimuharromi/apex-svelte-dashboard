<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search, CornerDownLeft, ArrowUp, ArrowDown, Moon, Plus } from '@lucide/svelte';
	import { NAV_GROUPS } from '$lib/layout/nav-items';
	import { APP_CONFIG } from '$lib/config';
	import { Modal } from '$lib/ui';
	import type { Component } from 'svelte';

	let {
		open = $bindable(false),
		onToggleTheme = () => {},
		onNewOrder = () => {},
	}: {
		open?: boolean;
		onToggleTheme?: () => void;
		onNewOrder?: () => void;
	} = $props();

	type Command = {
		label: string;
		href?: string;
		icon: Component;
		group: string;
		action?: () => void;
		badge?: string;
	};

	function groupBy(cmds: Command[]) {
		return cmds.reduce((acc, cmd) => {
			(acc[cmd.group] ??= []).push(cmd);
			return acc;
		}, {} as Record<string, Command[]>);
	}

	const allCommands: Command[] = $derived.by(() => {
		const cmds: Command[] = [];
		for (const group of NAV_GROUPS) {
			for (const item of group.items) {
				cmds.push({
					label: item.label,
					href: item.href,
					icon: item.icon,
					group: group.label,
					badge: item.badge ? String(item.badge) : undefined,
				});
			}
		}
		cmds.push(
			{ label: 'Toggle Theme', icon: Moon, group: 'Actions', action: onToggleTheme },
			{ label: 'New Order', icon: Plus, group: 'Actions', action: onNewOrder },
		);
		return cmds;
	});

	let query = $state('');
	let selectedIndex = $state(0);
	let listEl = $state<HTMLDivElement>();

	const filtered = $derived.by(() => {
		if (!query.trim()) return allCommands;
		const q = query.toLowerCase();
		return allCommands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
	});

	$effect(() => {
		if (open) {
			query = '';
			selectedIndex = 0;
		}
	});

	$effect(() => {
		query;
		selectedIndex = 0;
	});

	// Auto-scroll selected into view
	$effect(() => {
		selectedIndex;
		if (listEl) {
			const sel = listEl.querySelector('[data-selected="true"]');
			sel?.scrollIntoView({ block: 'nearest' });
		}
	});

	function execute(cmd: Command) {
		open = false;
		if (cmd.action) {
			cmd.action();
		} else if (cmd.href) {
			goto(cmd.href);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const cmd = filtered[selectedIndex];
			if (cmd) execute(cmd);
		}
	}

	const grouped = $derived(groupBy(filtered));
</script>

<Modal bind:open maxWidth="lg">
	<div class="relative -m-5 border-b border-border">
		<Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
		<input
			type="text"
			placeholder="Search pages, commands..."
			bind:value={query}
			onkeydown={handleKeydown}
			class="w-full h-14 bg-transparent pl-12 pr-4 border-none focus:outline-none focus:ring-0 text-lg"
		/>
	</div>

	<div bind:this={listEl} class="max-h-[400px] overflow-y-auto py-2 -mx-2">
		{#if filtered.length === 0}
			<div class="px-6 py-8 text-center text-muted-foreground text-sm">
				No results for "{query}"
			</div>
		{:else}
			{#each Object.entries(grouped) as [group, cmds]}
				<p class="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group}</p>
				{#each cmds as cmd (cmd.label + cmd.group)}
					{@const flatIndex = filtered.indexOf(cmd)}
					<button
						data-selected={flatIndex === selectedIndex ? 'true' : 'false'}
						class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left {flatIndex === selectedIndex
							? 'bg-primary/10 text-primary'
							: 'hover:bg-muted'}"
						onclick={() => execute(cmd)}
						onmouseenter={() => (selectedIndex = flatIndex)}
					>
						<div class="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
							<cmd.icon class="h-4 w-4 text-muted-foreground" />
						</div>
						<span class="flex-1 font-medium">{cmd.label}</span>
						{#if cmd.badge}
							<span class="inline-flex h-5 items-center justify-center rounded-full bg-primary px-2 text-[10px] font-medium text-primary-foreground">{cmd.badge}</span>
						{/if}
						{#if flatIndex === selectedIndex}
							<CornerDownLeft class="h-3.5 w-3.5 text-muted-foreground" />
						{/if}
					</button>
				{/each}
			{/each}
		{/if}
	</div>

	<div class="border-t border-border -mx-5 -mb-5 px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
		<div class="flex items-center gap-3">
			<span class="flex items-center gap-1">
				<kbd class="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-muted"><ArrowUp class="h-3 w-3" /></kbd>
				<kbd class="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-muted"><ArrowDown class="h-3 w-3" /></kbd>
				navigate
			</span>
			<span class="flex items-center gap-1">
				<kbd class="inline-flex h-5 items-center justify-center rounded border border-border bg-muted"><CornerDownLeft class="h-3 w-3" /></kbd>
				select
			</span>
		</div>
		<span class="font-medium">{APP_CONFIG.brand.name}</span>
	</div>
</Modal>
