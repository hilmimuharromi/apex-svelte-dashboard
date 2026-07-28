<script lang="ts">
	import { money, compact } from '$lib/utils';
	import { Package, TrendingUp, Archive, Star } from '@lucide/svelte';
	import { StatCard, Card, Badge, Button, Input, Select } from '$lib/ui';
	import { generateProducts, type Product } from '$lib/data/mock';

	const ALL = generateProducts(40);

	let search = $state('');
	let statusFilter = $state('All');
	let categoryFilter = $state('All');
	let page = $state(1);
	const PAGE_SIZE = 12;

	const categories = $derived(['All', ...new Set(ALL.map((p) => p.category))]);

	const filtered = $derived.by(() => {
		let rows = ALL;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
		}
		if (statusFilter !== 'All') rows = rows.filter((p) => p.status === statusFilter);
		if (categoryFilter !== 'All') rows = rows.filter((p) => p.category === categoryFilter);
		return rows;
	});

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const rows = $derived(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));

	$effect(() => { filtered; page = 1; });

	const STATUS_VARIANT: Record<Product['status'], 'success' | 'default' | 'danger'> = {
		Active: 'success', Draft: 'default', Archived: 'danger'
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Products</h1>
			<p class="mt-1 text-sm text-muted-foreground">{ALL.length} products in catalog</p>
		</div>
		<Button>Add Product</Button>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Products" value={ALL.length} icon={Package} />
		<StatCard label="Active" value={ALL.filter((p) => p.status === 'Active').length} icon={Star} />
		<StatCard label="Total Sales" value={compact(ALL.reduce((s, p) => s + p.sales, 0))} icon={TrendingUp} />
		<StatCard label="Archived" value={ALL.filter((p) => p.status === 'Archived').length} icon={Archive} />
	</div>

	<Card>
		<div class="flex flex-wrap gap-3 mb-5">
			<Input class="max-w-xs" placeholder="Search products…" bind:value={search} />
			<Select bind:value={categoryFilter} class="w-36">
				{#each categories as c}<option value={c}>{c}</option>{/each}
			</Select>
			<Select bind:value={statusFilter} class="w-36">
				{#each ['All', 'Active', 'Draft', 'Archived'] as s}<option value={s}>{s}</option>{/each}
			</Select>
			{#if search || statusFilter !== 'All' || categoryFilter !== 'All'}
				<Button variant="ghost" size="sm" onclick={() => { search = ''; statusFilter = 'All'; categoryFilter = 'All'; }}>
					Clear
				</Button>
			{/if}
			<span class="ml-auto self-center text-sm text-muted-foreground">{filtered.length} results</span>
		</div>

		<div class="-mx-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Product</th>
						<th class="px-5 py-3 text-left font-medium hidden sm:table-cell">Category</th>
						<th class="px-5 py-3 text-right font-medium">Price</th>
						<th class="px-5 py-3 text-right font-medium hidden md:table-cell">Stock</th>
						<th class="px-5 py-3 text-right font-medium hidden lg:table-cell">Sales</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
					</tr>
				</thead>
				<tbody>
					{#if rows.length === 0}
						<tr><td colspan="6" class="px-5 py-12 text-center text-muted-foreground">No products found.</td></tr>
					{:else}
						{#each rows as p (p.id)}
							<tr class="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer">
								<td class="px-5 py-3">
									<p class="font-medium">{p.name}</p>
									<p class="text-xs text-muted-foreground font-mono">{p.id}</p>
								</td>
								<td class="px-5 py-3 hidden sm:table-cell">
									<Badge variant="outline">{p.category}</Badge>
								</td>
								<td class="px-5 py-3 text-right tabular font-medium">{money(p.price)}</td>
								<td class="px-5 py-3 text-right tabular hidden md:table-cell">{p.stock.toLocaleString()}</td>
								<td class="px-5 py-3 text-right tabular hidden lg:table-cell">{p.sales.toLocaleString()}</td>
								<td class="px-5 py-3">
									<Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		{#if totalPages > 1}
			<div class="mt-4 flex items-center justify-between text-sm border-t border-border pt-4">
				<span class="text-muted-foreground">Page {page} of {totalPages}</span>
				<div class="flex gap-1">
					<Button variant="outline" size="sm" onclick={() => (page = Math.max(1, page - 1))} disabled={page === 1}>Prev</Button>
					{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => Math.max(1, Math.min(page - 2, totalPages - 4)) + i) as p}
						<Button variant={p === page ? 'primary' : 'ghost'} size="sm" onclick={() => (page = p)}>{p}</Button>
					{/each}
					<Button variant="outline" size="sm" onclick={() => (page = Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
				</div>
			</div>
		{/if}
	</Card>
</div>
