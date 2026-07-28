<script lang="ts">
	import { money } from '$lib/utils';
	import { Users, UserCheck, UserX, Crown } from '@lucide/svelte';
	import { StatCard, Card, Avatar, Badge, Button, Input, Select } from '$lib/ui';
	import { generateCustomers, type Customer } from '$lib/data/mock';

	const ALL = generateCustomers(60);

	let search = $state('');
	let planFilter = $state('All');
	let statusFilter = $state('All');
	let page = $state(1);
	const PAGE_SIZE = 12;

	const filtered = $derived.by(() => {
		let rows = ALL;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
		}
		if (planFilter !== 'All') rows = rows.filter((c) => c.plan === planFilter);
		if (statusFilter !== 'All') rows = rows.filter((c) => c.status === statusFilter);
		return rows;
	});

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const rows = $derived(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
	$effect(() => { filtered; page = 1; });

	const PLAN_VARIANT: Record<Customer['plan'], 'default' | 'primary' | 'info' | 'warning'> = {
		Free: 'default', Pro: 'primary', Business: 'info', Enterprise: 'warning'
	};
	const STATUS_VARIANT: Record<Customer['status'], 'success' | 'default' | 'danger'> = {
		Active: 'success', Inactive: 'default', Suspended: 'danger'
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Customers</h1>
			<p class="mt-1 text-sm text-muted-foreground">{ALL.length} registered customers</p>
		</div>
		<Button>Add Customer</Button>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total" value={ALL.length} icon={Users} />
		<StatCard label="Active" value={ALL.filter((c) => c.status === 'Active').length} icon={UserCheck} />
		<StatCard label="Suspended" value={ALL.filter((c) => c.status === 'Suspended').length} icon={UserX} />
		<StatCard label="Enterprise" value={ALL.filter((c) => c.plan === 'Enterprise').length} icon={Crown} />
	</div>

	<Card>
		<div class="flex flex-wrap gap-3 mb-5">
			<Input class="max-w-xs" placeholder="Search name, email, ID…" bind:value={search} />
			<Select bind:value={planFilter} class="w-36">
				{#each ['All', 'Free', 'Pro', 'Business', 'Enterprise'] as p}<option value={p}>{p}</option>{/each}
			</Select>
			<Select bind:value={statusFilter} class="w-36">
				{#each ['All', 'Active', 'Inactive', 'Suspended'] as s}<option value={s}>{s}</option>{/each}
			</Select>
			{#if search || planFilter !== 'All' || statusFilter !== 'All'}
				<Button variant="ghost" size="sm" onclick={() => { search = ''; planFilter = 'All'; statusFilter = 'All'; }}>Clear</Button>
			{/if}
			<span class="ml-auto self-center text-sm text-muted-foreground">{filtered.length} results</span>
		</div>

		<div class="-mx-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Customer</th>
						<th class="px-5 py-3 text-left font-medium hidden sm:table-cell">Plan</th>
						<th class="px-5 py-3 text-right font-medium hidden md:table-cell">LTV</th>
						<th class="px-5 py-3 text-left font-medium hidden lg:table-cell">Joined</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
					</tr>
				</thead>
				<tbody>
					{#if rows.length === 0}
						<tr><td colspan="5" class="px-5 py-12 text-center text-muted-foreground">No customers found.</td></tr>
					{:else}
						{#each rows as c (c.id)}
							<tr class="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer">
								<td class="px-5 py-3">
									<div class="flex items-center gap-2.5">
										<Avatar initials={c.initials} size="sm" />
										<div>
											<p class="font-medium leading-tight">{c.name}</p>
											<p class="text-xs text-muted-foreground">{c.email}</p>
										</div>
									</div>
								</td>
								<td class="px-5 py-3 hidden sm:table-cell">
									<Badge variant={PLAN_VARIANT[c.plan]}>{c.plan}</Badge>
								</td>
								<td class="px-5 py-3 text-right tabular hidden md:table-cell font-medium">{money(c.ltv)}</td>
								<td class="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">{c.joined}</td>
								<td class="px-5 py-3">
									<Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge>
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
						<Button variant={p === page ? 'default' : 'ghost'} size="sm" onclick={() => (page = p)}>{p}</Button>
					{/each}
					<Button variant="outline" size="sm" onclick={() => (page = Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
				</div>
			</div>
		{/if}
	</Card>
</div>
