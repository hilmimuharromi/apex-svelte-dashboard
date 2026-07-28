<script lang="ts">
	import { money } from '$lib/utils';
	import { ShoppingCart, DollarSign, CheckCircle, Clock, Package, Truck, MapPin, Eye } from '@lucide/svelte';
	import { StatCard, Card, Badge, Button, Input, Select, Modal } from '$lib/ui';
	import { generateOrders } from '$lib/data/mock';
	import type { Order, OrderStatus } from '$lib/types/catalog';

	const ALL = $state(generateOrders(80));

	let search = $state('');
	let statusFilter = $state('All');
	let page = $state(1);
	const PAGE_SIZE = 12;

	let selectedOrder: Order | null = $state(null);
	let modalOpen = $state(false);

	const filtered = $derived.by(() => {
		let rows = ALL;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter(
				(o) =>
					o.id.toLowerCase().includes(q) ||
					o.customerName.toLowerCase().includes(q)
			);
		}
		if (statusFilter !== 'All') {
			rows = rows.filter((o) => o.status === statusFilter);
		}
		return rows;
	});

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const rows = $derived(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));

	$effect(() => {
		filtered;
		page = 1;
	});

	const stats = $derived.by(() => {
		const total = ALL.reduce((s, o) => s + o.total, 0);
		const completed = ALL.filter((o) => o.status === 'delivered').length;
		const pending = ALL.filter((o) => o.status === 'pending' || o.status === 'paid').length;
		return { total, completed, pending, count: ALL.length };
	});

	const STATUS_VARIANT: Record<OrderStatus, 'warning' | 'info' | 'default' | 'primary' | 'success' | 'danger'> = {
		pending: 'warning',
		paid: 'info',
		packing: 'default',
		shipped: 'primary',
		delivered: 'success',
		cancelled: 'danger',
		returned: 'danger'
	};

	const timelineSteps: OrderStatus[] = ['pending', 'paid', 'packing', 'shipped', 'delivered'];

	function openDetail(order: Order) {
		selectedOrder = order;
		modalOpen = true;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Orders</h1>
			<p class="mt-1 text-sm text-muted-foreground">{ALL.length} total orders</p>
		</div>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Revenue" value={money(stats.total)} icon={DollarSign} />
		<StatCard label="All Orders" value={stats.count} icon={ShoppingCart} />
		<StatCard label="Completed" value={stats.completed} icon={CheckCircle} />
		<StatCard label="Pending" value={stats.pending} icon={Clock} />
	</div>

	<Card>
		<!-- Filters -->
		<div class="flex flex-wrap items-center gap-3 mb-5">
			<Input
				class="max-w-xs"
				placeholder="Search order ID, customer name…"
				bind:value={search}
			/>
			<Select bind:value={statusFilter} class="w-44">
				<option value="All">All Statuses</option>
				{#each ['pending', 'paid', 'packing', 'shipped', 'delivered', 'cancelled', 'returned'] as s}
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
						<th class="px-5 py-3 text-left font-medium">Order ID</th>
						<th class="px-5 py-3 text-left font-medium">Customer</th>
						<th class="px-5 py-3 text-center font-medium">Items</th>
						<th class="px-5 py-3 text-right font-medium">Total</th>
						<th class="px-5 py-3 text-left font-medium">Payment Method</th>
						<th class="px-5 py-3 text-left font-medium">Courier</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
						<th class="px-5 py-3 text-left font-medium">Date</th>
						<th class="px-5 py-3 text-center font-medium">Action</th>
					</tr>
				</thead>
				<tbody>
					{#if rows.length === 0}
						<tr>
							<td colspan="9" class="px-5 py-12 text-center text-muted-foreground">
								No orders match your filters.
							</td>
						</tr>
					{:else}
						{#each rows as order (order.id)}
							<tr
								class="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer"
								onclick={() => openDetail(order)}
								role="button"
								tabindex="0"
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										openDetail(order);
									}
								}}
							>
								<td class="px-5 py-3 font-mono text-xs font-bold text-muted-foreground">{order.id}</td>
								<td class="px-5 py-3">
									<div>
										<p class="font-medium leading-tight">{order.customerName}</p>
										<p class="text-xs text-muted-foreground mt-0.5">{order.customerPhone}</p>
									</div>
								</td>
								<td class="px-5 py-3 text-center tabular-nums">{order.items.reduce((s, it) => s + it.qty, 0)} pcs</td>
								<td class="px-5 py-3 text-right tabular-nums font-semibold text-foreground">{money(order.total)}</td>
								<td class="px-5 py-3 text-left text-muted-foreground">{order.paymentMethod}</td>
								<td class="px-5 py-3 text-left text-muted-foreground">{order.courier}</td>
								<td class="px-5 py-3">
									<Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
								</td>
								<td class="px-5 py-3 text-muted-foreground text-xs">
									{new Date(order.createdAt).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
									})}
								</td>
								<td class="px-5 py-3 text-center" onclick={(e) => e.stopPropagation()}>
									<Button variant="ghost" size="sm" onclick={() => openDetail(order)} aria-label="View Details">
										<Eye class="h-4 w-4" />
									</Button>
								</td>
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
							variant={p === page ? 'primary' : 'ghost'}
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

<!-- Order Details Modal -->
<Modal
	bind:open={modalOpen}
	title={selectedOrder ? `Order Detail: ${selectedOrder.id}` : ''}
	description="Complete tracking, shipping, and product list information."
	maxWidth="2xl"
>
	{#if selectedOrder}
		{@const order = selectedOrder}
		{@const currentIndex = timelineSteps.indexOf(order.status)}

		<div class="space-y-6 max-h-[70vh] overflow-y-auto px-1">
			<!-- Timeline -->
			<div>
				<h4 class="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Status Timeline</h4>
				<div class="py-4 px-2 border border-border rounded-xl bg-muted/10">
					{#if order.status === 'cancelled' || order.status === 'returned'}
						<div class="flex items-center justify-center p-3 text-center">
							<Badge variant="danger" class="text-sm font-semibold py-1 px-3">
								Order {order.status === 'cancelled' ? 'Cancelled' : 'Returned'}
							</Badge>
						</div>
					{:else}
						<div class="flex items-center justify-between w-full relative sm:px-6">
							<!-- Background Line -->
							<div class="absolute left-6 right-6 top-4 h-0.5 bg-muted -z-10"></div>
							<!-- Progress Line -->
							<div
								class="absolute left-6 top-4 h-0.5 bg-primary -z-10 transition-all duration-300"
								style="width: {currentIndex >= 0 ? (currentIndex / (timelineSteps.length - 1)) * 82 : 0}%"
							></div>

							{#each timelineSteps as step, idx}
								{@const isActive = idx <= currentIndex}
								{@const isCurrent = idx === currentIndex}
								<div class="flex flex-col items-center relative z-10">
									<div class="h-8 w-8 rounded-full border-2 flex items-center justify-center font-semibold text-xs transition-colors
										{isActive ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'}
										{isCurrent ? 'ring-4 ring-primary/20 scale-105' : ''}"
									>
										{#if isActive}
											<CheckCircle class="h-4 w-4" />
										{:else}
											{idx + 1}
										{/if}
									</div>
									<span class="text-[10px] mt-1.5 capitalize font-medium {isActive ? 'text-primary' : 'text-muted-foreground'}">
										{step}
									</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Customer and Shipping Address -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="space-y-1">
					<span class="text-xs text-muted-foreground block">Customer Information</span>
					<span class="font-medium text-sm block">{order.customerName}</span>
					<span class="text-xs text-muted-foreground block">{order.customerEmail}</span>
					<span class="text-xs text-muted-foreground block">{order.customerPhone}</span>
				</div>
				<div class="space-y-1">
					<span class="text-xs text-muted-foreground block flex items-center gap-1 font-semibold">
						<MapPin class="h-3.5 w-3.5" /> Shipping Address
					</span>
					<span class="text-xs text-muted-foreground block leading-relaxed">{order.shippingAddress}</span>
				</div>
			</div>

			<!-- Items List -->
			<div class="space-y-3">
				<h4 class="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
					<Package class="h-3.5 w-3.5" /> Items ({order.items.length})
				</h4>
				<div class="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
					{#each order.items as item}
						<div class="flex items-center gap-3 p-3">
							<img src={item.image} alt={item.productName} class="h-10 w-10 rounded-lg object-cover bg-muted shrink-0" />
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium truncate">{item.productName}</p>
								<p class="text-xs text-muted-foreground mt-0.5">
									{#if item.variantName}
										Variant: {item.variantName} ·
									{/if}
									Qty: {item.qty} × {money(item.price)}
								</p>
							</div>
							<span class="text-sm font-semibold tabular-nums">{money(item.price * item.qty)}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Shipping and Payment Details -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
				<div class="space-y-2">
					<div class="space-y-0.5">
						<span class="text-xs text-muted-foreground block flex items-center gap-1">
							<Truck class="h-3.5 w-3.5" /> Courier & Shipment
						</span>
						<span class="text-sm font-medium block">{order.courier}</span>
					</div>
					{#if order.trackingNumber}
						<div class="space-y-0.5">
							<span class="text-xs text-muted-foreground block">Tracking Number</span>
							<span class="text-xs font-mono font-bold bg-muted px-1.5 py-0.5 rounded inline-block">{order.trackingNumber}</span>
						</div>
					{/if}
				</div>
				<div class="space-y-2">
					<div class="space-y-0.5">
						<span class="text-xs text-muted-foreground block">Payment Method</span>
						<span class="text-sm font-medium block">{order.paymentMethod}</span>
					</div>
					{#if order.note}
						<div class="space-y-0.5">
							<span class="text-xs text-muted-foreground block">Notes</span>
							<span class="text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/10 text-amber-600 dark:text-amber-400 p-2 rounded block italic">
								"{order.note}"
							</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Calculation Summary -->
			<div class="border-t border-border pt-4 space-y-1.5 text-sm">
				<div class="flex justify-between text-muted-foreground">
					<span>Subtotal</span>
					<span class="tabular-nums">{money(order.subtotal)}</span>
				</div>
				<div class="flex justify-between text-muted-foreground">
					<span>Shipping Cost</span>
					<span class="tabular-nums">{money(order.shippingCost)}</span>
				</div>
				{#if order.discount > 0}
					<div class="flex justify-between text-success">
						<span>Discount</span>
						<span class="tabular-nums">-{money(order.discount)}</span>
					</div>
				{/if}
				<div class="flex justify-between font-bold text-base border-t border-border/50 pt-1.5">
					<span>Total</span>
					<span class="tabular-nums text-primary">{money(order.total)}</span>
				</div>
			</div>
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex justify-end">
			<Button variant="outline" onclick={() => (modalOpen = false)}>Close</Button>
		</div>
	{/snippet}
</Modal>
