<script lang="ts">
	import { Card } from '$lib/ui';
	import BarChart from '$lib/charts/BarChart.svelte';
	import LineChart from '$lib/charts/LineChart.svelte';
	import AreaChart from '$lib/charts/AreaChart.svelte';
	import DonutChart from '$lib/charts/DonutChart.svelte';

	const bars = [
		{ label: 'Q1', value: 42 },
		{ label: 'Q2', value: 58 },
		{ label: 'Q3', value: 47 },
		{ label: 'Q4', value: 71 }
	];
	const line = Array.from({ length: 24 }, (_, i) => ({ x: i, y: 50 + Math.sin(i / 2) * 25 + i * 1.2 }));
	const area = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 20 + Math.cos(i / 3) * 15 + i * 2 }));
	const donut = [
		{ label: 'A', value: 40 },
		{ label: 'B', value: 25 },
		{ label: 'C', value: 20 },
		{ label: 'D', value: 15 }
	];
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Charts</h1>
		<p class="mt-1 text-sm text-muted-foreground">Chart primitives showcase.</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
		<Card title="Bar Chart">
			<BarChart data={bars} yFormat={(v) => `${v}%`} height={220} />
		</Card>
		<Card title="Line Chart">
			<LineChart data={line} height={220} />
		</Card>
		<Card title="Area Chart">
			<AreaChart data={area} height={220} />
		</Card>
		<Card title="Donut Chart">
			<div class="flex justify-center">
				<DonutChart data={donut} centerLabel="Total" centerValue="100%" size={220} />
			</div>
		</Card>
	</div>
</div>
