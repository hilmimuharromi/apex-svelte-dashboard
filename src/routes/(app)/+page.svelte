<script lang="ts">
	import { money, pct, compact } from '$lib/utils';
	import { ArrowUp, ArrowDown, DollarSign, Users, ShoppingCart, Eye } from '@lucide/svelte';

	type Stat = {
		label: string;
		value: string;
		delta: number;
		icon: typeof DollarSign;
	};

	const stats: Stat[] = [
		{ label: 'Total Revenue', value: money(48295), delta: 12.5, icon: DollarSign },
		{ label: 'Active Users', value: (2847).toLocaleString(), delta: 8.2, icon: Users },
		{ label: 'Total Orders', value: (1432).toLocaleString(), delta: -3.1, icon: ShoppingCart },
		{ label: 'Page Views', value: compact(284000), delta: 24.7, icon: Eye }
	];
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
		<p class="text-sm text-muted-foreground mt-1">
			Welcome back — here's what's happening with your store today.
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each stats as stat}
			{@const up = stat.delta >= 0}
			<div class="rounded-xl border border-border bg-card p-5 shadow-sm">
				<div class="flex items-start justify-between">
					<p class="text-sm text-muted-foreground">{stat.label}</p>
					<div class="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
						<stat.icon class="h-4 w-4 text-muted-foreground" />
					</div>
				</div>
				<p class="mt-3 text-2xl font-semibold tabular">{stat.value}</p>
				<div class="mt-2 flex items-center gap-1 text-xs">
					<span class="inline-flex items-center gap-0.5 font-medium {up ? 'text-success' : 'text-danger'}">
						{#if up}
							<ArrowUp class="h-3 w-3" />
						{:else}
							<ArrowDown class="h-3 w-3" />
						{/if}
						{pct(stat.delta)}
					</span>
					<span class="text-muted-foreground">vs last month</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
		<p class="text-sm text-muted-foreground">Shell + Header + Sidebar wired ✓</p>
		<p class="text-xs text-muted-foreground mt-1">
			Phase 1.1–1.3 complete. Charts, tables, and remaining widgets land in Phase 2–3.
		</p>
	</div>
</div>
