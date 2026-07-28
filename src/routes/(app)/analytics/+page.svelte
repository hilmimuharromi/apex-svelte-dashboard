<script lang="ts">
	import { money, pct, compact } from '$lib/utils';
	import { Users, MousePointerClick, Clock, TrendingUp } from '@lucide/svelte';
	import { StatCard, Card } from '$lib/ui';
	import LineChart from '$lib/charts/LineChart.svelte';
	import BarChart from '$lib/charts/BarChart.svelte';

	const traffic = Array.from({ length: 30 }, (_, i) => ({
		x: i,
		y: 1200 + Math.sin(i / 3) * 400 + i * 40 + Math.random() * 200
	}));
	const devices = [
		{ label: 'Desktop', value: 58 },
		{ label: 'Mobile', value: 34 },
		{ label: 'Tablet', value: 8 }
	];
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Analytics</h1>
		<p class="mt-1 text-sm text-muted-foreground">Traffic, engagement, and conversion insights.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Sessions" value={compact(48293)} delta={12.4} icon={Users} />
		<StatCard label="Pageviews" value={compact(184920)} delta={8.7} icon={MousePointerClick} />
		<StatCard label="Avg. Duration" value="4m 12s" delta={-2.3} icon={Clock} />
		<StatCard label="Bounce Rate" value={pct(32.5)} delta={-4.1} icon={TrendingUp} invert />
	</div>

	<Card title="Traffic — last 30 days" description="Sessions per day">
		<LineChart data={traffic} height={260} />
	</Card>

	<Card title="Devices" description="Sessions by device category">
		<BarChart data={devices} yFormat={(v) => `${v}%`} height={220} />
	</Card>
</div>
