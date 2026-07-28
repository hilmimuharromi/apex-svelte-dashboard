<script lang="ts">
	import { money, pct, compact } from '$lib/utils';
	import { DollarSign, Users, ShoppingCart, Eye } from '@lucide/svelte';
	import {
		StatCard,
		Card,
		Button,
		ProgressBar,
		StatusPill,
		Avatar
	} from '$lib/ui';
	import BarChart from '$lib/charts/BarChart.svelte';
	import DonutChart from '$lib/charts/DonutChart.svelte';
	import {
		RECENT_ORDERS,
		MONTHLY_REVENUE,
		TRAFFIC_SOURCES,
		GOALS,
		DASHBOARD_SUMMARY
	} from '$lib/data/dashboard';

	let chartTab = $state<'Revenue' | 'Orders' | 'Profit'>('Revenue');
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
		<p class="text-sm text-muted-foreground mt-1">
			Welcome back — here's what's happening with your store today.
		</p>
	</div>

	<!-- Stat cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Revenue" value={money(58295000)} delta={12.5} icon={DollarSign} />
		<StatCard label="Active Users" value={(2847).toLocaleString()} delta={8.2} icon={Users} />
		<StatCard label="Total Orders" value={(1432).toLocaleString()} delta={-3.1} icon={ShoppingCart} />
		<StatCard label="Page Views" value={compact(284000)} delta={24.7} icon={Eye} />
	</div>

	<!-- Overview chart + summary -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
		<Card class="lg:col-span-2">
			{#snippet header()}
				<div>
					<h3 class="text-base font-semibold">Overview</h3>
					<p class="mt-1 text-sm text-muted-foreground">Monthly performance for the current year</p>
				</div>
			{/snippet}
			{#snippet action()}
				<div class="inline-flex rounded-lg border border-border bg-muted/40 p-1">
					{#each ['Revenue', 'Orders', 'Profit'] as tab}
						<button
							onclick={() => (chartTab = tab as typeof chartTab)}
							class="rounded-md px-3 py-1 text-xs font-medium transition-colors {chartTab === tab
								? 'bg-card text-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground'}"
						>
							{tab}
						</button>
					{/each}
				</div>
			{/snippet}
			<BarChart data={MONTHLY_REVENUE} yFormat={(v) => money(v).replace('Rp', 'Rp ').replace(/\s+/g, ' ')} height={280} />
		</Card>

		<Card title="Summary" description="Year-to-date snapshot">
			<div class="space-y-4">
				<div>
					<p class="text-xs text-muted-foreground">Total Revenue</p>
					<p class="text-2xl font-semibold tabular">{money(DASHBOARD_SUMMARY.total)}</p>
					<p class="text-xs text-muted-foreground">full year</p>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-lg border border-border p-3">
						<p class="text-xs text-muted-foreground">Monthly avg</p>
						<p class="text-sm font-semibold tabular">{money(DASHBOARD_SUMMARY.monthlyAvg)}</p>
					</div>
					<div class="rounded-lg border border-border p-3">
						<p class="text-xs text-muted-foreground">Peak month</p>
						<p class="text-sm font-semibold">{DASHBOARD_SUMMARY.peakMonth.label}</p>
						<p class="text-xs tabular">{money(DASHBOARD_SUMMARY.peakMonth.value)}</p>
					</div>
				</div>
				<div class="rounded-lg border border-border p-3">
					<p class="text-xs text-muted-foreground">YoY growth</p>
					<p class="text-lg font-semibold text-success tabular">{pct(DASHBOARD_SUMMARY.yoyGrowth)}</p>
					<p class="text-xs text-muted-foreground">Jan → Dec</p>
				</div>
			</div>
		</Card>
	</div>

	<!-- Traffic + Goals -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
		<Card title="Traffic Sources" description="Sessions by channel">
			<div class="grid grid-cols-2 gap-4 items-center">
				<DonutChart data={TRAFFIC_SOURCES} centerLabel="Traffic" centerValue="100%" />
				<ul class="space-y-3">
					{#each TRAFFIC_SOURCES as src, i}
						{@const colors = ['bg-primary', 'bg-info', 'bg-warning', 'bg-danger']}
						<li class="flex items-center justify-between text-sm">
							<span class="inline-flex items-center gap-2">
								<span class="h-2.5 w-2.5 rounded-full {colors[i]}"></span>
								{src.label}
							</span>
							<span class="tabular font-medium">{src.value}%</span>
						</li>
					{/each}
				</ul>
			</div>
		</Card>

		<Card title="Goals" description="Progress toward monthly targets">
			<div class="space-y-5">
				{#each GOALS as goal}
					<ProgressBar {...goal} />
				{/each}
			</div>
		</Card>
	</div>

	<!-- Recent orders -->
	<Card>
		{#snippet header()}
			<div>
				<h3 class="text-base font-semibold">Recent Orders</h3>
				<p class="mt-1 text-sm text-muted-foreground">Latest transactions from your store</p>
			</div>
		{/snippet}
		{#snippet action()}
			<Button variant="ghost" size="sm">View all</Button>
		{/snippet}
		<div class="-m-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Customer</th>
						<th class="px-5 py-3 text-left font-medium">Product</th>
						<th class="px-5 py-3 text-right font-medium">Amount</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each RECENT_ORDERS as order (order.id)}
						<tr class="border-t border-border hover:bg-muted/40 transition-colors">
							<td class="px-5 py-3">
								<div class="flex items-center gap-3">
									<Avatar initials={order.customer.initials} size="sm" />
									<div>
										<div class="font-medium">{order.customer.name}</div>
										<div class="text-xs text-muted-foreground font-mono">{order.id}</div>
									</div>
								</div>
							</td>
							<td class="px-5 py-3">{order.product}</td>
							<td class="px-5 py-3 text-right tabular font-medium">{money(order.amount)}</td>
							<td class="px-5 py-3"><StatusPill status={order.status} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>
