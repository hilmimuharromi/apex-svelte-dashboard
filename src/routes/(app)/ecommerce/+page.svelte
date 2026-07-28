<script lang="ts">
	import { money, compact } from '$lib/utils';
	import { DollarSign, Package, ShoppingCart, TrendingUp } from '@lucide/svelte';
	import { StatCard, Card, StatusPill, Avatar } from '$lib/ui';
	import BarChart from '$lib/charts/BarChart.svelte';

	const revenue = [
		{ label: 'Mon', value: 4200 },
		{ label: 'Tue', value: 5100 },
		{ label: 'Wed', value: 4800 },
		{ label: 'Thu', value: 6300 },
		{ label: 'Fri', value: 7500 },
		{ label: 'Sat', value: 8200 },
		{ label: 'Sun', value: 5900 }
	];

	const topProducts = [
		{ name: 'Pro Dashboard License', sold: 142, revenue: 42458 },
		{ name: 'Enterprise Plan', sold: 38, revenue: 56962 },
		{ name: 'Team Plan Upgrade', sold: 87, revenue: 52113 },
		{ name: 'Single License', sold: 231, revenue: 18249 },
		{ name: 'Add-on: Analytics', sold: 64, revenue: 6336 }
	];
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">eCommerce</h1>
		<p class="mt-1 text-sm text-muted-foreground">Store performance and product insights.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Revenue (7d)" value={money(42000)} delta={14.2} icon={DollarSign} />
		<StatCard label="Orders (7d)" value="562" delta={9.1} icon={ShoppingCart} />
		<StatCard label="Avg Order" value={money(74.73)} delta={4.8} icon={TrendingUp} />
		<StatCard label="In Stock" value={compact(1284)} delta={-1.2} icon={Package} />
	</div>

	<Card title="Weekly Revenue" description="Last 7 days">
		<BarChart data={revenue} yFormat={(v) => `$${v / 1000}k`} height={240} />
	</Card>

	<Card title="Top Products" description="By revenue this week">
		<div class="-m-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Product</th>
						<th class="px-5 py-3 text-right font-medium">Sold</th>
						<th class="px-5 py-3 text-right font-medium">Revenue</th>
					</tr>
				</thead>
				<tbody>
					{#each topProducts as p}
						<tr class="border-t border-border hover:bg-muted/40 transition-colors">
							<td class="px-5 py-3 font-medium">{p.name}</td>
							<td class="px-5 py-3 text-right tabular">{p.sold}</td>
							<td class="px-5 py-3 text-right tabular font-medium">{money(p.revenue)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>
