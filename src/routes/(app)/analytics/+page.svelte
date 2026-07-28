<script lang="ts">
	import { StatCard, Card, Badge, ProgressBar } from '$lib/ui';
	import LineChart from '$lib/charts/LineChart.svelte';
	import BarChart from '$lib/charts/BarChart.svelte';
	import { money, compact, pct } from '$lib/utils';
	import { generateProducts } from '$lib/data/mock';
	import { TrendingUp, ShoppingBag, Users, Star, Package, Baby } from '@lucide/svelte';

	// 30 Days of mock daily revenue (IDR scale)
	const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
		const base = 3500000;
		const sine = Math.sin(i / 2.5) * 1200000;
		const trend = i * 150000;
		const noise = Math.random() * 800000;
		return {
			x: i + 1,
			y: base + sine + trend + noise
		};
	});

	// Get products and sort them to find best sellers
	const allProducts = generateProducts(30);
	const topProducts = [...allProducts]
		.sort((a, b) => b.sales - a.sales)
		.slice(0, 5);

	// Map top 5 products for best sellers BarChart
	const bestSellersChartData = topProducts.map((p) => ({
		label: p.name.split(' ')[0], // short name (e.g. "Sunscreen")
		value: p.sales
	}));

	// Demographic distributions
	const ageDemographics = [
		{ label: '0-6 bln (Newborn)', value: 18, color: 'info' as const },
		{ label: '6-12 bln (Infant)', value: 24, color: 'success' as const },
		{ label: '1-3 thn (Toddler)', value: 38, color: 'primary' as const },
		{ label: '3+ thn (Kids & Family)', value: 20, color: 'warning' as const }
	];

	const skinTypes = [
		{ label: 'Sensitive Skin', value: 52, color: 'danger' as const },
		{ label: 'Dry Skin', value: 28, color: 'warning' as const },
		{ label: 'Normal Skin', value: 15, color: 'success' as const },
		{ label: 'Oily Skin', value: 5, color: 'info' as const }
	];
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">E-Commerce Analytics</h1>
			<p class="mt-1 text-sm text-muted-foreground">Detailed metrics on revenue, target customer segments, and products.</p>
		</div>
		<Badge variant="primary" class="gap-1">
			<Baby class="h-3 w-3" /> Kids Personal Care Store
		</Badge>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard
			label="Revenue"
			value={money(142400000, 'IDR', 'id-ID')}
			delta={12.4}
			icon={ShoppingBag}
		/>
		<StatCard
			label="Orders"
			value="2,450"
			delta={8.2}
			icon={Package}
		/>
		<StatCard
			label="Avg. Order Value"
			value={money(58120, 'IDR', 'id-ID')}
			delta={3.5}
			icon={TrendingUp}
		/>
		<StatCard
			label="Repeat Purchase Rate"
			value="42.6%"
			delta={5.1}
			icon={Users}
		/>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Main Revenue Line Chart -->
		<Card
			class="lg:col-span-2"
			title="Store Revenue Trends (30 Days)"
			description="Daily sales revenue showing steady growth."
		>
			<div class="mt-4">
				<LineChart data={dailyRevenue} height={260} />
			</div>
			{#snippet footer()}
				<div class="flex items-center justify-between text-xs text-muted-foreground">
					<span>Total 30d Revenue: <strong>{money(142400000, 'IDR', 'id-ID')}</strong></span>
					<span class="flex items-center gap-1 text-success font-medium">
						<TrendingUp class="h-3 w-3" /> Average +12.4% weekly
					</span>
				</div>
			{/snippet}
		</Card>

		<!-- Best Sellers Bar Chart -->
		<Card
			title="Best Selling Categories"
			description="Sales counts for leading products."
		>
			<div class="mt-4">
				<BarChart
					data={bestSellersChartData}
					yFormat={(v) => `${compact(v)} pcs`}
					height={220}
				/>
			</div>
		</Card>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- Top 5 Products List -->
		<Card
			class="lg:col-span-2"
			title="Top 5 Performing Products"
			description="Ordered by units sold."
		>
			<div class="mt-4 overflow-x-auto">
				<table class="w-full text-sm text-left">
					<thead>
						<tr class="border-b border-border text-muted-foreground text-xs font-medium uppercase">
							<th class="pb-3 pl-2">Product Name</th>
							<th class="pb-3">Category</th>
							<th class="pb-3 text-right">Units Sold</th>
							<th class="pb-3 text-right">Selling Price</th>
							<th class="pb-3 text-right pr-2">Estimated Revenue</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border/60">
						{#each topProducts as product, index}
							<tr class="hover:bg-muted/40 transition-colors">
								<td class="py-3 pl-2 font-medium flex items-center gap-2">
									<span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary font-bold">
										{index + 1}
									</span>
									<span class="truncate max-w-[180px]" title={product.name}>{product.name}</span>
								</td>
								<td class="py-3">
									<Badge variant="outline">{product.category}</Badge>
								</td>
								<td class="py-3 text-right font-mono tabular-nums">{compact(product.sales)}</td>
								<td class="py-3 text-right font-mono tabular-nums">{money(product.price, 'IDR', 'id-ID')}</td>
								<td class="py-3 text-right font-mono tabular-nums font-semibold pr-2 text-primary">
									{money(product.sales * product.price, 'IDR', 'id-ID')}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card>

		<!-- Demographics Breakdown -->
		<Card
			title="Target Demographics"
			description="Age ranges & skin specifications."
		>
			<div class="space-y-6 mt-4">
				<div>
					<h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
						<Baby class="h-3.5 w-3.5" /> Age Group Segment
					</h4>
					<div class="space-y-3">
						{#each ageDemographics as item}
							<ProgressBar
								label={item.label}
								value={item.value}
								color={item.color}
							/>
						{/each}
					</div>
				</div>

				<div class="border-t border-border/60 pt-4">
					<h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
						<Star class="h-3.5 w-3.5" /> Skin Sensitivity Segment
					</h4>
					<div class="space-y-3">
						{#each skinTypes as item}
							<ProgressBar
								label={item.label}
								value={item.value}
								color={item.color}
							/>
						{/each}
					</div>
				</div>
			</div>
		</Card>
	</div>
</div>
