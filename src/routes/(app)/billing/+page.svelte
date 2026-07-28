<script lang="ts">
	import { money } from '$lib/utils';
	import { CreditCard, Check, Download, AlertCircle } from '@lucide/svelte';
	import { Card, Button, Badge, ProgressBar } from '$lib/ui';

	const PLANS = [
		{ name: 'Starter', price: 0, features: ['1 workspace', '3 team members', 'Community support', '1GB storage'] },
		{ name: 'Pro', price: 29, features: ['10 workspaces', 'Unlimited members', 'Priority support', '100GB storage', 'API access'], popular: true },
		{ name: 'Business', price: 99, features: ['Unlimited workspaces', 'SSO / SAML', 'Dedicated CSM', '1TB storage', 'Custom integrations', 'SLA'] }
	];

	const INVOICES = [
		{ id: 'INV-2026-006', date: '01 Jul 2026', amount: 99, status: 'Paid' as const },
		{ id: 'INV-2026-005', date: '01 Jun 2026', amount: 99, status: 'Paid' as const },
		{ id: 'INV-2026-004', date: '01 May 2026', amount: 99, status: 'Paid' as const },
		{ id: 'INV-2026-003', date: '01 Apr 2026', amount: 99, status: 'Paid' as const },
		{ id: 'INV-2026-002', date: '01 Mar 2026', amount: 99, status: 'Paid' as const },
		{ id: 'INV-2026-001', date: '01 Feb 2026', amount: 99, status: 'Paid' as const }
	];

	const USAGE = [
		{ label: 'API Calls', used: 84200, limit: 100000, unit: '' },
		{ label: 'Storage', used: 340, limit: 1024, unit: 'GB' },
		{ label: 'Team seats', used: 18, limit: 25, unit: '' },
		{ label: 'Workspaces', used: 7, limit: 10, unit: '' }
	];

	let currentPlan = $state('Business');
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Billing</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage your subscription and payment methods</p>
	</div>

	<!-- Current plan -->
	<div class="grid gap-6 lg:grid-cols-3">
		<Card class="lg:col-span-2">
			<div class="flex items-start justify-between">
				<div>
					<div class="flex items-center gap-2">
						<Badge variant="primary">{currentPlan}</Badge>
						<span class="text-xs text-muted-foreground">renews on 1 Aug 2026</span>
					</div>
					<h2 class="mt-3 text-3xl font-bold tabular">$99<span class="text-base font-normal text-muted-foreground">/month</span></h2>
					<p class="mt-1 text-sm text-muted-foreground">Billed monthly · next charge $99 on 1 Aug 2026</p>
				</div>
				<div class="flex flex-col gap-2">
					<Button variant="outline">Change plan</Button>
					<Button variant="ghost" size="sm">Cancel subscription</Button>
				</div>
			</div>

			<div class="mt-6 pt-6 border-t border-border">
				<h3 class="text-sm font-semibold mb-4">Current usage this cycle</h3>
				<div class="space-y-4">
					{#each USAGE as u}
						<div>
							<div class="flex items-center justify-between text-sm mb-1.5">
								<span class="text-muted-foreground">{u.label}</span>
								<span class="tabular font-medium">
									{u.used.toLocaleString()}{u.unit} <span class="text-muted-foreground">/ {u.limit.toLocaleString()}{u.unit}</span>
								</span>
							</div>
							<ProgressBar value={(u.used / u.limit) * 100} color={u.used / u.limit > 0.9 ? 'danger' : u.used / u.limit > 0.75 ? 'warning' : 'primary'} />
						</div>
					{/each}
				</div>
			</div>
		</Card>

		<Card>
			<h3 class="font-semibold">Payment method</h3>
			<div class="mt-4 rounded-lg border border-border p-4 flex items-center gap-3">
				<div class="h-10 w-14 rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xs font-bold">
					VISA
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium">•••• 4242</p>
					<p class="text-xs text-muted-foreground">Expires 12/28</p>
				</div>
			</div>
			<Button variant="outline" class="w-full mt-3">Update card</Button>

			<div class="mt-6 pt-6 border-t border-border">
				<h3 class="font-semibold">Billing address</h3>
				<p class="mt-3 text-sm">Aigars Silkalns</p>
				<p class="text-sm text-muted-foreground">123 Business Ave, Suite 100</p>
				<p class="text-sm text-muted-foreground">San Francisco, CA 94103</p>
				<Button variant="ghost" size="sm" class="mt-3 -ml-3">Edit address</Button>
			</div>
		</Card>
	</div>

	<!-- Plans -->
	<div>
		<h2 class="text-lg font-semibold mb-4">Available plans</h2>
		<div class="grid gap-4 md:grid-cols-3">
			{#each PLANS as plan}
				<Card class="{plan.popular ? 'border-primary shadow-md relative' : ''}">
					{#if plan.popular}
						<div class="absolute -top-3 left-1/2 -translate-x-1/2">
							<Badge variant="primary">Most Popular</Badge>
						</div>
					{/if}
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-semibold">{plan.name}</h3>
						{#if currentPlan === plan.name}
							<Badge variant="success">Current</Badge>
						{/if}
					</div>
					<div class="mb-4">
						<span class="text-3xl font-bold tabular">${plan.price}</span>
						<span class="text-sm text-muted-foreground">/month</span>
					</div>
					<ul class="space-y-2 mb-5 text-sm">
						{#each plan.features as f}
							<li class="flex items-center gap-2">
								<Check class="h-3.5 w-3.5 text-success shrink-0" />
								<span>{f}</span>
							</li>
						{/each}
					</ul>
					<Button
						variant={currentPlan === plan.name ? 'outline' : 'primary'}
						class="w-full"
						disabled={currentPlan === plan.name}
					>
						{currentPlan === plan.name ? 'Current plan' : plan.price > 99 ? 'Upgrade' : 'Downgrade'}
					</Button>
				</Card>
			{/each}
		</div>
	</div>

	<!-- Invoices -->
	<Card>
		<div class="flex items-center justify-between mb-4">
			<div>
				<h3 class="text-base font-semibold">Billing history</h3>
				<p class="text-sm text-muted-foreground">Past invoices and payments</p>
			</div>
			<Button variant="outline" size="sm">Download all</Button>
		</div>
		<div class="-mx-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Invoice</th>
						<th class="px-5 py-3 text-left font-medium">Date</th>
						<th class="px-5 py-3 text-right font-medium">Amount</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
						<th class="px-5 py-3"></th>
					</tr>
				</thead>
				<tbody>
					{#each INVOICES as inv}
						<tr class="border-t border-border">
							<td class="px-5 py-3 font-mono text-xs">{inv.id}</td>
							<td class="px-5 py-3 text-muted-foreground">{inv.date}</td>
							<td class="px-5 py-3 text-right tabular font-medium">{money(inv.amount)}</td>
							<td class="px-5 py-3"><Badge variant="success">{inv.status}</Badge></td>
							<td class="px-5 py-3 text-right">
								<button class="inline-flex items-center gap-1 text-sm text-primary hover:underline">
									<Download class="h-3.5 w-3.5" /> PDF
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>
