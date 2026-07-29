<script lang="ts">
	import { Card, Badge, Button, Input, Select, FormField, Modal, StatCard, ProgressBar, EmptyState } from '$lib/ui';
	import type { Promo } from '$lib/types/catalog';
	import { generatePromos } from '$lib/data/mock';
	import { money } from '$lib/utils';
	import { Tag, Plus, Pencil, Percent, Gift, Clock } from '@lucide/svelte';

	let promos = $state<Promo[]>(data.promos);

	let isEditing = $state(false);
	let modalOpen = $state(false);
	let form = $state<Promo>({
		id: '',
		code: '',
		title: '',
		type: 'percentage',
		value: 0,
		minPurchase: 0,
		maxUsage: 100,
		usedCount: 0,
		startDate: '',
		endDate: '',
		status: 'active'
	});

	// Stats
	const totalPromos = $derived(promos.length);
	const activePromos = $derived(promos.filter((p) => p.status === 'active').length);
	const scheduledPromos = $derived(promos.filter((p) => p.status === 'scheduled').length);
	const expiredPromos = $derived(promos.filter((p) => p.status === 'expired').length);

	const statusBadgeVariants = {
		active: 'success',
		scheduled: 'info',
		expired: 'danger'
	} as const;

	function openAdd() {
		isEditing = false;
		form = {
			id: `PRM-${String(promos.length + 1).padStart(3, '0')}`,
			code: '',
			title: '',
			type: 'percentage',
			value: 0,
			minPurchase: 0,
			maxUsage: 100,
			usedCount: 0,
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			status: 'active'
		};
		modalOpen = true;
	}

	function openEdit(promo: Promo) {
		isEditing = true;
		form = { ...promo };
		modalOpen = true;
	}

	function save() {
		if (isEditing) {
			const idx = promos.findIndex((p) => p.id === form.id);
			if (idx !== -1) {
				clientApi.put(`/api/promos/${form.id}`, { body: form }).then(r => promos[idx] = r as any);
				promos[idx] = { ...form };
			}
		} else {
			clientApi.post('/api/promos', { body: form }).then(r => promos.push(r as any));
		}
		modalOpen = false;
	}

	function deletePromo(id: string) {
		if (confirm('Are you sure you want to delete this promo?')) {
			clientApi.delete(`/api/promos/${id}`).then(() => {
				promos = promos.filter((p) => p.id !== id);
			});
		}
	}

	function getPromoValueDisplay(type: Promo['type'], val: number): string {
		if (type === 'percentage') {
			return `${val}% OFF`;
		} else if (type === 'fixed') {
			return `${money(val, 'IDR', 'id-ID')} OFF`;
		} else if (type === 'bogo') {
			return `Buy 1 Get ${val}`;
		}
		return `${val}`;
	}
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

</script>

<div class="space-y-6 text-foreground">
	<!-- Head -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Promo Codes</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage and track discount codes, coupons, and BOGO deals.</p>
		</div>
		<Button onclick={openAdd} class="gap-1.5">
			<Plus class="w-4 h-4" />
			Add Promo
		</Button>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<StatCard label="Total Promos" value={totalPromos} icon={Tag} />
		<StatCard label="Active" value={activePromos} icon={Percent} />
		<StatCard label="Scheduled" value={scheduledPromos} icon={Clock} />
		<StatCard label="Expired" value={expiredPromos} icon={Gift} />
	</div>

	<!-- Table / Card Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{#if promos.length === 0}
			<div class="col-span-full">
				<EmptyState title="No promo codes found" description="Click 'Add Promo' to create one." />
			</div>
		{:else}
			{#each promos as p (p.id)}
				<Card class="flex flex-col justify-between space-y-4 p-5">
					<div class="space-y-3">
						<div class="flex items-start justify-between">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<code class="font-mono bg-muted text-primary py-0.5 px-2 rounded font-bold text-sm tracking-wider select-all">
										{p.code}
									</code>
									<Badge variant={statusBadgeVariants[p.status]}>
										{p.status.toUpperCase()}
									</Badge>
								</div>
								<h3 class="font-semibold text-base pt-1 leading-tight">{p.title}</h3>
							</div>

							<div class="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
								{#if p.type === 'percentage'}
									<Percent class="w-4 h-4" />
								{:else if p.type === 'fixed'}
									<Gift class="w-4 h-4" />
								{:else}
									<Tag class="w-4 h-4" />
								{/if}
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4 py-2 border-y border-border/50 text-xs">
							<div>
								<span class="text-muted-foreground">Promo Value</span>
								<p class="font-bold text-sm text-foreground mt-0.5">
									{getPromoValueDisplay(p.type, p.value)}
								</p>
							</div>
							<div>
								<span class="text-muted-foreground">Min. Purchase</span>
								<p class="font-semibold text-sm text-foreground mt-0.5">
									{money(p.minPurchase, 'IDR', 'id-ID')}
								</p>
							</div>
						</div>

						<!-- Usage Progress Bar -->
						<div class="space-y-1">
							<div class="flex items-center justify-between text-xs text-muted-foreground">
								<span>Usage Limit</span>
								<span>{p.usedCount} / {p.maxUsage} used</span>
							</div>
							<ProgressBar value={Math.round((p.usedCount / p.maxUsage) * 100)} color={p.status === 'expired' ? 'danger' : 'primary'} />
						</div>

						<div class="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
							<Clock class="w-3.5 h-3.5" />
							<span>Validity: {p.startDate} to {p.endDate}</span>
						</div>
					</div>

					<div class="pt-4 flex items-center justify-end gap-2 border-t border-border/50">
						<Button variant="outline" size="sm" onclick={() => openEdit(p)} class="gap-1">
							<Pencil class="w-3.5 h-3.5" />
							Edit
						</Button>
						<Button variant="danger" size="sm" onclick={() => deletePromo(p.id)}>
							Delete
						</Button>
					</div>
				</Card>
			{/each}
		{/if}
	</div>

	<!-- Add/Edit Modal -->
	<Modal bind:open={modalOpen} title={isEditing ? 'Edit Promo' : 'Add Promo'} maxWidth="md">
		<div class="space-y-4 text-foreground">
			<div class="grid grid-cols-2 gap-4">
				<FormField label="Promo Code" required>
					<Input placeholder="e.g. HEMAT10" bind:value={form.code} class="font-mono uppercase" />
				</FormField>

				<FormField label="Promo Type" required>
					<Select bind:value={form.type}>
						<option value="percentage">Percentage Discount</option>
						<option value="fixed">Fixed Amount Discount</option>
						<option value="bogo">BOGO (Buy 1 Get 1)</option>
					</Select>
				</FormField>
			</div>

			<FormField label="Promo Title" required>
				<Input placeholder="e.g. Diskon 10% Seluruh Produk" bind:value={form.title} />
			</FormField>

			<div class="grid grid-cols-2 gap-4">
				<FormField label="Promo Value" required description={form.type === 'percentage' ? 'In percent, e.g. 10' : (form.type === 'bogo' ? 'Number of free items, e.g. 1' : 'In IDR value, e.g. 20000')}>
					<Input type="number" min="0" bind:value={form.value} />
				</FormField>

				<FormField label="Min. Purchase (IDR)" required>
					<Input type="number" min="0" bind:value={form.minPurchase} />
				</FormField>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<FormField label="Max Usage Limt" required>
					<Input type="number" min="1" bind:value={form.maxUsage} />
				</FormField>

				<FormField label="Used Count" required={isEditing}>
					<Input type="number" min="0" bind:value={form.usedCount} disabled={!isEditing} />
				</FormField>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<FormField label="Start Date" required>
					<Input type="date" bind:value={form.startDate} />
				</FormField>

				<FormField label="End Date" required>
					<Input type="date" bind:value={form.endDate} />
				</FormField>
			</div>

			<FormField label="Status" required>
				<Select bind:value={form.status}>
					<option value="active">Active</option>
					<option value="scheduled">Scheduled</option>
					<option value="expired">Expired</option>
				</Select>
			</FormField>
		</div>

		{#snippet footer()}
			<Button variant="outline" onclick={() => (modalOpen = false)}>Cancel</Button>
			<Button variant="primary" onclick={save}>Save Changes</Button>
		{/snippet}
	</Modal>
</div>
