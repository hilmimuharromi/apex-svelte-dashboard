<script lang="ts">
	import { compact, money } from '$lib/utils';
	import { Users, UserPlus, Handshake, Target } from '@lucide/svelte';
	import { StatCard, Card, Avatar, StatusPill, Badge } from '$lib/ui';
	import LineChart from '$lib/charts/LineChart.svelte';

	const pipeline = Array.from({ length: 12 }, (_, i) => ({ x: i, y: 40 + i * 6 + Math.sin(i) * 8 }));

	const deals = [
		{ company: 'Acme Corp', contact: 'Emma Wilson', value: 24500, stage: 'Negotiation', status: 'Processing' as const },
		{ company: 'Globex Inc', contact: 'James Chen', value: 12800, stage: 'Proposal', status: 'Pending' as const },
		{ company: 'Initech', contact: 'Sofia Garcia', value: 48000, stage: 'Closed Won', status: 'Completed' as const },
		{ company: 'Umbrella', contact: 'Alex Thompson', value: 8200, stage: 'Discovery', status: 'Pending' as const },
		{ company: 'Wayne Ent.', contact: 'Maria Santos', value: 96000, stage: 'Negotiation', status: 'Processing' as const }
	];
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">CRM</h1>
		<p class="mt-1 text-sm text-muted-foreground">Deals, contacts, and pipeline overview.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Contacts" value={compact(12847)} delta={6.3} icon={Users} />
		<StatCard label="New Leads" value="284" delta={18.7} icon={UserPlus} />
		<StatCard label="Deals" value="42" delta={-2.1} icon={Handshake} />
		<StatCard label="Win Rate" value="68%" delta={4.5} icon={Target} />
	</div>

	<Card title="Pipeline" description="Weighted forecast, last 12 weeks">
		<LineChart data={pipeline} height={220} />
	</Card>

	<Card title="Recent Deals" description="Active opportunities">
		<div class="-m-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Company</th>
						<th class="px-5 py-3 text-left font-medium">Contact</th>
						<th class="px-5 py-3 text-left font-medium">Stage</th>
						<th class="px-5 py-3 text-right font-medium">Value</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each deals as d}
						<tr class="border-t border-border hover:bg-muted/40 transition-colors">
							<td class="px-5 py-3 font-medium">{d.company}</td>
							<td class="px-5 py-3">
								<div class="flex items-center gap-2">
									<Avatar name={d.contact} size="xs" />
									<span>{d.contact}</span>
								</div>
							</td>
							<td class="px-5 py-3"><Badge variant="outline">{d.stage}</Badge></td>
							<td class="px-5 py-3 text-right tabular font-medium">{money(d.value)}</td>
							<td class="px-5 py-3"><StatusPill status={d.status} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>
