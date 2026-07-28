<script lang="ts">
	import { money } from '$lib/utils';
	import { Receipt, DollarSign, Clock, AlertCircle } from '@lucide/svelte';
	import { StatCard, Card, Badge, Button, Input, Select } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';
	import { generateInvoices, type Invoice } from '$lib/data/invoices';

	const ALL = generateInvoices(30);

	let search = $state('');
	let statusFilter = $state('All');

	const filtered = $derived.by(() => {
		let rows = ALL;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter((v) => v.number.toLowerCase().includes(q) || v.client.name.toLowerCase().includes(q) || v.client.company.toLowerCase().includes(q));
		}
		if (statusFilter !== 'All') rows = rows.filter((v) => v.status === statusFilter);
		return rows;
	});

	const stats = $derived.by(() => {
		const paid = ALL.filter((v) => v.status === 'Paid').reduce((s, v) => s + v.amount, 0);
		const pending = ALL.filter((v) => v.status === 'Pending').reduce((s, v) => s + v.amount, 0);
		const overdue = ALL.filter((v) => v.status === 'Overdue').reduce((s, v) => s + v.amount, 0);
		return { paid, pending, overdue, count: ALL.length };
	});

	const STATUS_VARIANT: Record<Invoice['status'], 'success' | 'warning' | 'danger' | 'default'> = {
		Paid: 'success', Pending: 'warning', Overdue: 'danger', Draft: 'default'
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Invoices</h1>
			<p class="mt-1 text-sm text-muted-foreground">{ALL.length} total invoices</p>
		</div>
		<Button onclick={() => toast.success('New invoice', 'Invoice draft created.')}>New Invoice</Button>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Paid" value={money(stats.paid)} icon={DollarSign} />
		<StatCard label="Pending" value={money(stats.pending)} icon={Clock} />
		<StatCard label="Overdue" value={money(stats.overdue)} icon={AlertCircle} />
		<StatCard label="Total" value={stats.count} icon={Receipt} />
	</div>

	<Card>
		<div class="flex flex-wrap gap-3 mb-5">
			<Input class="max-w-xs" placeholder="Search invoice, client, company…" bind:value={search} />
			<Select bind:value={statusFilter} class="w-40">
				{#each ['All', 'Paid', 'Pending', 'Overdue', 'Draft'] as s}<option value={s}>{s}</option>{/each}
			</Select>
			<span class="ml-auto self-center text-sm text-muted-foreground">{filtered.length} results</span>
		</div>

		<div class="-mx-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Invoice #</th>
						<th class="px-5 py-3 text-left font-medium">Client</th>
						<th class="px-5 py-3 text-right font-medium">Amount</th>
						<th class="px-5 py-3 text-left font-medium hidden md:table-cell">Issued</th>
						<th class="px-5 py-3 text-left font-medium hidden lg:table-cell">Due</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
						<th class="px-5 py-3"></th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as inv (inv.id)}
						<tr class="border-t border-border hover:bg-muted/40 transition-colors">
							<td class="px-5 py-3 font-mono text-xs">{inv.number}</td>
							<td class="px-5 py-3">
								<p class="font-medium leading-tight">{inv.client.name}</p>
								<p class="text-xs text-muted-foreground">{inv.client.company}</p>
							</td>
							<td class="px-5 py-3 text-right tabular font-medium">{money(inv.amount)}</td>
							<td class="px-5 py-3 hidden md:table-cell text-muted-foreground text-xs">{inv.issued}</td>
							<td class="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">{inv.due}</td>
							<td class="px-5 py-3"><Badge variant={STATUS_VARIANT[inv.status]}>{inv.status}</Badge></td>
							<td class="px-5 py-3 text-right">
								<a href="/invoices/{inv.id}" class="text-sm text-primary hover:underline">View</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>
