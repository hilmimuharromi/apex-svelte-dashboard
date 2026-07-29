<script lang="ts">
	import { StatCard, Card, Badge, Avatar, Button, Input, Select, Modal, EmptyState } from '$lib/ui';
	import { generateCustomers } from '$lib/data/mock';
	import type { Customer } from '$lib/types/catalog';
	import { money, compact } from '$lib/utils';
	import { Users, UserCheck, Crown, Star, Baby, Phone, Eye } from '@lucide/svelte';

	const ALL = generateCustomers(60);

	let search = $state('');
	let membershipFilter = $state('All');
	let page = $state(1);
	const PAGE_SIZE = 12;

	let selectedCustomer = $state<Customer | null>(null);
	let showModal = $state(false);

	const filtered = $derived.by(() => {
		let rows = ALL;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter(
				(c) =>
					c.name.toLowerCase().includes(q) ||
					c.email.toLowerCase().includes(q) ||
					c.id.toLowerCase().includes(q)
			);
		}
		if (membershipFilter !== 'All') {
			rows = rows.filter((c) => c.membership === membershipFilter);
		}
		return rows;
	});

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const rows = $derived(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));

	$effect(() => {
		search;
		membershipFilter;
		page = 1;
	});

	// Stats
	const totalCustomers = ALL.length;
	const activeFilterCount = $derived(filtered.length);
	const goldPlusCount = ALL.filter(
		(c) => c.membership === 'Gold' || c.membership === 'Platinum'
	).length;
	const totalRevenue = ALL.reduce((sum, c) => sum + c.totalSpent, 0);

	const membershipBadgeVariant = (member: Customer['membership']) => {
		switch (member) {
			case 'Bronze': return 'default';
			case 'Silver': return 'info';
			case 'Gold': return 'warning';
			case 'Platinum': return 'primary';
			default: return 'default';
		}
	};

	function getAge(birthDateStr: string): string {
		const birthDate = new Date(birthDateStr);
		const today = new Date(2026, 6, 28); // Standardized to mid-2026 as per dataset
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		if (age > 0) {
			return `${age} tahun`;
		}
		const months = today.getMonth() - birthDate.getMonth() + (m < 0 ? 12 : 0);
		return `${months > 0 ? months : 0} bulan`;
	}

	function openDetail(customer: Customer) {
		selectedCustomer = customer;
		showModal = true;
	}
</script>

<div class="space-y-6">
	<!-- Head -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Customers</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage and overview your customers & children profiles.</p>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Customers" value={totalCustomers} icon={Users} />
		<StatCard label="Active (Filter)" value={activeFilterCount} icon={UserCheck} />
		<StatCard label="Gold+ Members" value={goldPlusCount} icon={Crown} />
		<StatCard label="Total Revenue" value={money(totalRevenue, 'IDR', 'id-ID')} icon={Star} />
	</div>

	<Card>
		<!-- Filters and Actions -->
		<div class="flex flex-wrap gap-3 mb-5 items-center">
			<Input class="max-w-xs" placeholder="Search name, email, ID…" bind:value={search} />
			<Select bind:value={membershipFilter} class="w-44">
				<option value="All">All Membership</option>
				<option value="Bronze">Bronze</option>
				<option value="Silver">Silver</option>
				<option value="Gold">Gold</option>
				<option value="Platinum">Platinum</option>
			</Select>
			{#if search || membershipFilter !== 'All'}
				<Button variant="ghost" size="sm" onclick={() => { search = ''; membershipFilter = 'All'; }}>Clear</Button>
			{/if}
			<span class="ml-auto text-sm text-muted-foreground">{filtered.length} results</span>
		</div>

		<!-- Table -->
		<div class="-mx-5 overflow-x-auto md:mx-0">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Customer</th>
						<th class="px-5 py-3 text-left font-medium">Membership</th>
						<th class="px-5 py-3 text-right font-medium">Orders</th>
						<th class="px-5 py-3 text-right font-medium">Total Spent</th>
						<th class="px-5 py-3 text-right font-medium">Points</th>
						<th class="px-5 py-3 text-center font-medium">Children</th>
						<th class="px-5 py-3 text-left font-medium">Last Order</th>
						<th class="px-5 py-3 text-center font-medium">Action</th>
					</tr>
				</thead>
				<tbody>
					{#if rows.length === 0}
						<tr>
							<td colspan="8" class="px-5 py-6">
								<EmptyState title="No customers found" description="Try adjusting your search query or membership status filter." />
							</td>
						</tr>
					{:else}
						{#each rows as c (c.id)}
							<tr 
								class="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer"
								onclick={() => openDetail(c)}
							>
								<td class="px-5 py-3.5">
									<div class="flex items-center gap-2.5">
										<Avatar initials={c.initials} src={c.avatar} size="sm" name={c.name} />
										<div>
											<p class="font-medium leading-tight text-foreground">{c.name}</p>
											<p class="text-xs text-muted-foreground">{c.email}</p>
										</div>
									</div>
								</td>
								<td class="px-5 py-3.5">
									<Badge variant={membershipBadgeVariant(c.membership)}>{c.membership}</Badge>
								</td>
								<td class="px-5 py-3.5 text-right font-medium tabular text-foreground">{c.totalOrders}</td>
								<td class="px-5 py-3.5 text-right font-medium tabular text-success">
									{money(c.totalSpent, 'IDR', 'id-ID')}
								</td>
								<td class="px-5 py-3.5 text-right font-medium tabular text-primary">
									{compact(c.points, 'id-ID')}
								</td>
								<td class="px-5 py-3.5 text-center">
									<Badge variant="outline" class="gap-1">
										<Baby class="w-3.5 h-3.5" />
										{c.children.length}
									</Badge>
								</td>
								<td class="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
									{new Date(c.lastOrderAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
								</td>
								<td class="px-5 py-3.5 text-center text-foreground" onclick={(e) => e.stopPropagation()}>
									<Button variant="ghost" size="sm" class="h-8 w-8 p-0" onclick={() => openDetail(c)} title="View Detail">
										<Eye class="w-4 h-4 text-muted-foreground" />
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

	<!-- Detail Modal -->
	<Modal bind:open={showModal} title="Customer details" maxWidth="lg">
		{#if selectedCustomer}
			<div class="space-y-6 text-foreground">
				<!-- Header Info -->
				<div class="flex items-start gap-4 pb-4 border-b border-border">
					<Avatar initials={selectedCustomer.initials} src={selectedCustomer.avatar} size="lg" name={selectedCustomer.name} />
					<div class="space-y-1">
						<h3 class="text-lg font-bold leading-tight">{selectedCustomer.name}</h3>
						<p class="text-sm text-muted-foreground">{selectedCustomer.email}</p>
						<div class="flex items-center gap-2 text-xs text-muted-foreground">
							<Phone class="w-3.5 h-3.5" />
							<span>{selectedCustomer.phone}</span>
						</div>
						<div class="pt-1 flex gap-2">
							<Badge variant={membershipBadgeVariant(selectedCustomer.membership)}>
								{selectedCustomer.membership} Member
							</Badge>
							<Badge variant="outline">ID: {selectedCustomer.id}</Badge>
						</div>
					</div>
				</div>

				<!-- Stats Grid Inside Modal -->
				<div class="grid grid-cols-3 gap-3">
					<div class="bg-muted/40 p-3 rounded-lg text-center">
						<p class="text-xs text-muted-foreground mb-1">Total Orders</p>
						<p class="text-lg font-bold tabular">{selectedCustomer.totalOrders}</p>
					</div>
					<div class="bg-muted/40 p-3 rounded-lg text-center">
						<p class="text-xs text-muted-foreground mb-1">Total Spent</p>
						<p class="text-sm font-bold tabular text-success">{money(selectedCustomer.totalSpent, 'IDR', 'id-ID')}</p>
					</div>
					<div class="bg-muted/40 p-3 rounded-lg text-center">
						<p class="text-xs text-muted-foreground mb-1">Loyalty Points</p>
						<p class="text-lg font-bold tabular text-primary">{selectedCustomer.points}</p>
					</div>
				</div>

				<!-- Info Section -->
				<div class="space-y-2">
					<h4 class="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Metadata</h4>
					<div class="grid grid-cols-2 gap-2 text-xs">
						<div>
							<span class="text-muted-foreground">Registered on:</span>
							<p class="font-medium text-foreground">
								{new Date(selectedCustomer.joinedAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
							</p>
						</div>
						<div>
							<span class="text-muted-foreground">Last Order on:</span>
							<p class="font-medium text-foreground">
								{new Date(selectedCustomer.lastOrderAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
							</p>
						</div>
					</div>
				</div>

				<!-- Children Section -->
				<div class="space-y-3 pt-2">
					<div class="flex items-center gap-2 border-b border-border pb-1.5">
						<Baby class="w-4 h-4 text-primary" />
						<h4 class="font-semibold text-sm">Children Profiles ({selectedCustomer.children.length})</h4>
					</div>
					{#if selectedCustomer.children.length === 0}
						<p class="text-xs text-muted-foreground">No child profiles registered.</p>
					{:else}
						<div class="grid gap-3">
							{#each selectedCustomer.children as child (child.id)}
								<div class="p-3 bg-card border border-border rounded-lg space-y-2 text-xs">
									<div class="flex items-center justify-between">
										<p class="font-bold text-foreground text-sm">{child.name}</p>
										<Badge variant="outline">
											{child.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
										</Badge>
									</div>
									<div class="grid grid-cols-3 gap-2">
										<div>
											<span class="text-[10px] text-muted-foreground uppercase">Age</span>
											<p class="font-medium text-foreground">{getAge(child.birthDate)}</p>
										</div>
										<div>
											<span class="text-[10px] text-muted-foreground uppercase">Skin Type</span>
											<p class="font-medium text-foreground">{child.skinType}</p>
										</div>
										<div>
											<span class="text-[10px] text-muted-foreground uppercase">Allergies</span>
											<p class="font-medium text-foreground text-danger">{child.allergies ? child.allergies : 'Tidak ada'}</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
		{#snippet footer()}
			<Button variant="outline" onclick={() => (showModal = false)}>Close</Button>
		{/snippet}
	</Modal>
</div>
