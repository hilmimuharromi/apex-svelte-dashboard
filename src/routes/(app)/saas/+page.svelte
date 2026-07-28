<script lang="ts">
	import { money, compact, pct } from '$lib/utils';
	import { Users, DollarSign, Activity, Zap } from '@lucide/svelte';
	import { StatCard, Card, ProgressBar } from '$lib/ui';
	import AreaChart from '$lib/charts/AreaChart.svelte';

	const mrr = Array.from({ length: 12 }, (_, i) => ({ x: i, y: 12000 + i * 1400 + Math.sin(i) * 500 }));

	const plans = [
		{ label: 'Starter', value: 42, description: '843 users' },
		{ label: 'Pro', value: 76, description: '1,528 users' },
		{ label: 'Business', value: 58, description: '312 users' },
		{ label: 'Enterprise', value: 24, description: '48 users' }
	];
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">SaaS</h1>
		<p class="mt-1 text-sm text-muted-foreground">Subscription metrics and cohort health.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="MRR" value={money(28450)} delta={8.4} icon={DollarSign} />
		<StatCard label="Active Users" value={compact(2731)} delta={3.2} icon={Users} />
		<StatCard label="Churn Rate" value={pct(2.4)} delta={-0.6} icon={Activity} invert />
		<StatCard label="ARPU" value={money(10.42)} delta={5.1} icon={Zap} />
	</div>

	<Card title="MRR Growth" description="Last 12 months">
		<AreaChart data={mrr} height={260} />
	</Card>

	<Card title="Plan Distribution" description="Share of active subscribers">
		<div class="space-y-5">
			{#each plans as p}
				<ProgressBar {...p} />
			{/each}
		</div>
	</Card>
</div>
