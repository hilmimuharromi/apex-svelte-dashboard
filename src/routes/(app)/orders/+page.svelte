<script lang="ts">
	import { money } from '$lib/utils';
	import { ShoppingCart, DollarSign, CheckCircle, Clock } from '@lucide/svelte';
	import { StatCard, Card, Avatar, StatusPill, Button, Input, Select } from '$lib/ui';
	import { generateOrders, type Order } from '$lib/data/mock';

	const ALL = generateOrders(80);

	let search = $state('');
	let statusFilter = $state('All');
	let page = $state(1);
	const PAGE_SIZE = 12;

	const filtered = $derived.by(() => {
		let rows = ALL;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter(
				(o) =>
					o.id.toLowerCase().includes(q) ||
					o.customer.name.toLowerCase().includes(q) ||
					o.product.toLowerCase().includes(q)
			);
		}
		if (statusFilter !== 'All') rows = rows.filter((o) => o.status === statusFilter);
		return rows;
	});

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const rows = $derived(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));

	$effect(() => { filtered; page = 1; });

	const stats = $derived.by(() => {
		const total = ALL.reduce((s, o) => s + o.amount, 0);
		const completed = ALL.filter((o) => o.status === 'Completed').length;
		const pending = ALL.filter((o) => o.status === 'Pending').length;
		return { total, completed, pending, count: ALL.length };
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Orders</h1>
			<p class="mt-1 text-sm text-muted-foreground">{ALL.length} total orders</p>
		</div>
		<Button>New Order</Button>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Revenue" value={money(stats.total)} icon={DollarSign} />
		<StatCard label="All Orders" value={stats.count} icon={ShoppingCart} />
		<StatCard label="Completed" value={stats.completed} icon={CheckCircle} />
		<StatCard label="Pending" value={stats.pending} icon={Clock} />
	</div>

	<Card>
		<!-- Filters -->
		<div class="flex flex-wrap gap-3 mb-5">
			<Input
				class="max-w-xs"
				placeholder="Search orders, customer…"
				bind:value={search}
			/>
			<Select bind:value={statusFilter} class="w-40">
				{#each ['All', 'Completed', 'Processing', 'Pending', 'Cancelled'] as s}
					<option value={s}>{s}</option>
				{/each}
			</Select>
			{#if search || statusFilter !== 'All'}
				<Button variant="ghost" size="sm" onclick={() => { search = ''; statusFilter = 'All'; }}>
					Clear filters
				</Button>
			{/if}
			<span class="ml-auto self-center text-sm text-muted-foreground">
				{filtered.length} result{filtered.length !== 1 ? 's' : ''}
			</span>
		</div>

		<!-- Table -->
		<div class="-mx-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Order</th>
						<th class="px-5 py-3 text-left font-medium">Customer</th>
						<th class="px-5 py-3 text-left font-medium hidden md:table-cell">Product</th>
						<th class="px-5 py-3 text-right font-medium">Amount</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
						<th class="px-5 py-3 text-left font-medium hidden lg:table-cell">Date</th>
					</tr>
				</thead>
				<tbody>
					{#if rows.length === 0}
						<tr>
							<td colspan="6" class="px-5 py-12 text-center text-muted-foreground">
								No orders match your filters.
							</td>
						</tr>
					{:else}
						{#each rows as order (order.id)}
							<tr class="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer">
								<td class="px-5 py-3 font-mono text-xs text-muted-foreground">{order.id}</td>
								<td class="px-5 py-3">
									<div class="flex items-center gap-2.5">
										<Avatar initials={order.customer.initials} size="sm" />
										<div>
											<p class="font-medium leading-tight">{order.customer.name}</p>
											<p class="text-xs text-muted-foreground">{order.customer.email}</p>
										</div>
									</div>
								</td>
								<td class="px-5 py-3 hidden md:table-cell">{order.product}</td>
								<td class="px-5 py-3 text-right tabular font-medium">{money(order.amount)}</td>
								<td class="px-5 py-3"><StatusPill status={order.status} /></td>
								<td class="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">{order.date}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="mt-4 flex items-center justify-between text-sm border-t border-border pt-4">
				<span class="text-muted-foreground">
					Page {page} of {totalPages}
				</span>
				<div class="flex gap-1">
					<Button variant="outline" size="sm" onclick={() => (page = Math.max(1, page - 1))} disabled={page === 1}>
						Prev
					</Button>
					{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
						const start = Math.max(1, Math.min(page - 2, totalPages - 4));
						return start + i;
					}) as p}
						<Button
							variant={p === page ? 'default' : 'ghost'}
							size="sm"
							onclick={() => (page = p)}
						>{p}</Button>
					{/each}
					<Button variant="outline" size="sm" onclick={() => (page = Math.min(totalPages, page + 1))} disabled={page === totalPages}>
						Next
					</Button>
				</div>
			</div>
		{/if}
	</Card>
</div>
