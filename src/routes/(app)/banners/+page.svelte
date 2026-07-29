<script lang="ts">
	import { Card, Badge, Button, Input, Select, FormField, Modal, ImageUpload, StatCard, EmptyState } from '$lib/ui';
	import type { Banner } from '$lib/types/catalog';
	import { generateBanners } from '$lib/data/mock';
	import { Megaphone, Plus, Pencil, Eye, Calendar } from '@lucide/svelte';

	let banners = $state<Banner[]>(generateBanners());

	let isEditing = $state(false);
	let modalOpen = $state(false);
	let form = $state<Banner>({
		id: '',
		title: '',
		subtitle: '',
		image: '',
		link: '',
		position: 'home_top',
		status: 'active',
		sortOrder: 1,
		startDate: '',
		endDate: ''
	});

	// Derived metrics
	const totalBanners = $derived(banners.length);
	const activeBanners = $derived(banners.filter((b) => b.status === 'active').length);
	const inactiveBanners = $derived(banners.filter((b) => b.status === 'inactive').length);

	// Derived sorted list
	const sortedBanners = $derived([...banners].sort((a, b) => a.sortOrder - b.sortOrder));

	const positionNames = {
		home_top: 'Home Top',
		home_mid: 'Home Middle',
		category: 'Category Page'
	};

	const positionBadgeVariants = {
		home_top: 'primary',
		home_mid: 'info',
		category: 'warning'
	} as const;

	function openAdd() {
		isEditing = false;
		form = {
			id: `BNR-${String(banners.length + 1).padStart(3, '0')}`,
			title: '',
			subtitle: '',
			image: '',
			link: '',
			position: 'home_top',
			status: 'active',
			sortOrder: banners.length + 1,
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
		};
		modalOpen = true;
	}

	function openEdit(banner: Banner) {
		isEditing = true;
		form = { ...banner };
		modalOpen = true;
	}

	function save() {
		if (isEditing) {
			const idx = banners.findIndex((b) => b.id === form.id);
			if (idx !== -1) {
				banners[idx] = { ...form };
			}
		} else {
			banners.push({ ...form });
		}
		modalOpen = false;
	}

	function deleteBanner(id: string) {
		if (confirm('Are you sure you want to delete this banner?')) {
			banners = banners.filter((b) => b.id !== id);
		}
	}
</script>

<div class="space-y-6 text-foreground">
	<!-- Head -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Banners</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage e-commerce promotional banners and locations.</p>
		</div>
		<Button onclick={openAdd} class="gap-1.5">
			<Plus class="w-4 h-4" />
			Add Banner
		</Button>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<StatCard label="Total Banners" value={totalBanners} icon={Megaphone} />
		<StatCard label="Active" value={activeBanners} icon={Megaphone} />
		<StatCard label="Inactive" value={inactiveBanners} icon={Megaphone} />
	</div>

	<!-- Card Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#if sortedBanners.length === 0}
			<div class="col-span-full">
				<EmptyState title="No banners found" description="Click 'Add Banner' to create one." />
			</div>
		{:else}
			{#each sortedBanners as b (b.id)}
				<Card class="flex flex-col h-full overflow-hidden group">
					<!-- Banner Preview Image -->
					<div class="relative aspect-[21/9] bg-muted overflow-hidden border-b border-border">
						{#if b.image}
							<img src={b.image} alt={b.title} class="h-full w-full object-cover transition-transform group-hover:scale-105" />
						{:else}
							<div class="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/50">
								<Megaphone class="w-8 h-8" />
							</div>
						{/if}
						<div class="absolute top-2 left-2 flex gap-1.5">
							<Badge variant={positionBadgeVariants[b.position]}>
								{positionNames[b.position]}
							</Badge>
							<Badge variant={b.status === 'active' ? 'success' : 'danger'}>
								{b.status === 'active' ? 'Active' : 'Inactive'}
							</Badge>
						</div>
						<div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-muted border border-border text-foreground text-xs px-2 py-0.5 rounded shadow">
							Order: {b.sortOrder}
						</div>
					</div>

					<!-- Content -->
					<div class="p-5 flex-1 flex flex-col justify-between space-y-4">
						<div class="space-y-1">
							<h3 class="font-semibold text-lg leading-snug">{b.title}</h3>
							<p class="text-xs text-muted-foreground line-clamp-2">{b.subtitle}</p>
						</div>

						<div class="space-y-2 pt-2 border-t border-border/50 text-xs">
							<div class="flex items-center gap-1.5 text-muted-foreground">
								<Calendar class="w-3.5 h-3.5" />
								<span>{b.startDate} to {b.endDate}</span>
							</div>
							<div class="flex items-center gap-1.5 text-muted-foreground">
								<Eye class="w-3.5 h-3.5" />
								<span class="truncate">Link: {b.link}</span>
							</div>
						</div>

						<div class="pt-4 flex items-center justify-end gap-2">
							<Button variant="outline" size="sm" onclick={() => openEdit(b)} class="gap-1">
								<Pencil class="w-3.5 h-3.5" />
								Edit
							</Button>
							<Button variant="danger" size="sm" onclick={() => deleteBanner(b.id)}>
								Delete
							</Button>
						</div>
					</div>
				</Card>
			{/each}
		{/if}
	</div>

	<!-- Add/Edit Modal -->
	<Modal bind:open={modalOpen} title={isEditing ? 'Edit Banner' : 'Add Banner'} maxWidth="md">
		<div class="space-y-4 text-foreground">
			<FormField label="Banner Image" required>
				<ImageUpload bind:value={form.image} variant="wide" />
			</FormField>

			<FormField label="Title" required>
				<Input placeholder="e.g. Promo Back to School" bind:value={form.title} />
			</FormField>

			<FormField label="Subtitle" required>
				<Input placeholder="e.g. Diskon 20% semua produk anak" bind:value={form.subtitle} />
			</FormField>

			<FormField label="Link/Destination Path" required>
				<Input placeholder="e.g. /promo/back-to-school" bind:value={form.link} />
			</FormField>

			<div class="grid grid-cols-2 gap-4">
				<FormField label="Position" required>
					<Select bind:value={form.position}>
						<option value="home_top">Home Top</option>
						<option value="home_mid">Home Middle</option>
						<option value="category">Category Page</option>
					</Select>
				</FormField>

				<FormField label="Sort Order" required>
					<Input type="number" min="1" bind:value={form.sortOrder} />
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

			<FormField label="Status Toggle">
				<div class="flex gap-2">
					<Button
						type="button"
						variant={form.status === 'active' ? 'primary' : 'outline'}
						onclick={() => (form.status = 'active')}
						class="w-full"
					>
						Active
					</Button>
					<Button
						type="button"
						variant={form.status === 'inactive' ? 'danger' : 'outline'}
						onclick={() => (form.status = 'inactive')}
						class="w-full"
					>
						Inactive
					</Button>
				</div>
			</FormField>
		</div>

		{#snippet footer()}
			<Button variant="outline" onclick={() => (modalOpen = false)}>Cancel</Button>
			<Button variant="primary" onclick={save}>Save Changes</Button>
		{/snippet}
	</Modal>
</div>
