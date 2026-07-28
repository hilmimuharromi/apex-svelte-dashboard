<script lang="ts">
	import { money, compact } from '$lib/utils';
	import { Package, TrendingUp, Archive, Star, Pencil, Plus } from '@lucide/svelte';
	import { StatCard, Card, Badge, Button, Input, Select, Label, FormField, Modal, RichTextEditor, ImageUpload } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';
	import { generateProducts, type Product } from '$lib/data/mock';

	const ALL = generateProducts(40);

	let search = $state('');
	let statusFilter = $state('All');
	let categoryFilter = $state('All');
	let page = $state(1);
	const PAGE_SIZE = 8;

	const categories = $derived(['All', ...new Set(ALL.map((p) => p.category))]);

	const filtered = $derived.by(() => {
		let rows = ALL;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
		}
		if (statusFilter !== 'All') rows = rows.filter((p) => p.status === statusFilter);
		if (categoryFilter !== 'All') rows = rows.filter((p) => p.category === categoryFilter);
		return rows;
	});

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const rows = $derived(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));

	$effect(() => { filtered; page = 1; });

	const STATUS_VARIANT: Record<Product['status'], 'success' | 'default' | 'danger'> = {
		Active: 'success', Draft: 'default', Archived: 'danger'
	};

	// ── Add/Edit modal ──
	let modalOpen = $state(false);
	let editingProduct: Product | null = $state(null);

	let formData = $state({
		name: '',
		category: 'License',
		price: 0,
		stock: 0,
		status: 'Active' as Product['status'],
		image: '',
		description: '',
	});

	function openAdd() {
		editingProduct = null;
		formData = { name: '', category: 'License', price: 0, stock: 0, status: 'Active', image: '', description: '' };
		modalOpen = true;
	}

	function openEdit(p: Product) {
		editingProduct = p;
		formData = { name: p.name, category: p.category, price: p.price, stock: p.stock, status: p.status, image: p.image, description: p.description };
		modalOpen = true;
	}

	function saveProduct() {
		if (!formData.name.trim()) {
			toast.danger('Validation', 'Product name is required.');
			return;
		}
		if (editingProduct) {
			Object.assign(editingProduct, formData);
			toast.success('Updated', `${formData.name} has been updated.`);
		} else {
			ALL.unshift({
				id: `PRD-${Date.now()}`,
				sales: 0,
				...formData,
			});
			toast.success('Created', `${formData.name} added to catalog.`);
		}
		modalOpen = false;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Products</h1>
			<p class="mt-1 text-sm text-muted-foreground">{ALL.length} products in catalog</p>
		</div>
		<Button onclick={openAdd}><Plus class="h-4 w-4" /> Add Product</Button>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Products" value={ALL.length} icon={Package} />
		<StatCard label="Active" value={ALL.filter((p) => p.status === 'Active').length} icon={Star} />
		<StatCard label="Total Sales" value={compact(ALL.reduce((s, p) => s + p.sales, 0))} icon={TrendingUp} />
		<StatCard label="Archived" value={ALL.filter((p) => p.status === 'Archived').length} icon={Archive} />
	</div>

	<!-- Product grid -->
	<div class="flex flex-wrap gap-3 mb-5">
		<Input class="max-w-xs" placeholder="Search products…" bind:value={search} />
		<Select bind:value={categoryFilter} class="w-36">
			{#each categories as c}<option value={c}>{c}</option>{/each}
		</Select>
		<Select bind:value={statusFilter} class="w-36">
			{#each ['All', 'Active', 'Draft', 'Archived'] as s}<option value={s}>{s}</option>{/each}
		</Select>
		{#if search || statusFilter !== 'All' || categoryFilter !== 'All'}
			<Button variant="ghost" size="sm" onclick={() => { search = ''; statusFilter = 'All'; categoryFilter = 'All'; }}>Clear</Button>
		{/if}
		<span class="ml-auto self-center text-sm text-muted-foreground">{filtered.length} results</span>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each rows as p (p.id)}
			<Card class="overflow-hidden group cursor-pointer" >
				<div class="relative aspect-video bg-muted overflow-hidden" onclick={() => openEdit(p)}>
					<img src={p.image} alt={p.name} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
					<div class="absolute top-2 right-2">
						<Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
					</div>
				</div>
				<div class="p-4 space-y-2">
					<div class="flex items-start justify-between gap-2">
						<div class="min-w-0">
							<p class="font-medium truncate">{p.name}</p>
							<p class="text-xs text-muted-foreground font-mono">{p.id}</p>
						</div>
						<button
							class="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
							onclick={() => openEdit(p)}
							aria-label="Edit product"
						>
							<Pencil class="h-3.5 w-3.5" />
						</button>
					</div>
					<div class="flex items-center gap-2">
						<Badge variant="outline">{p.category}</Badge>
						<span class="text-xs text-muted-foreground">{p.stock.toLocaleString()} in stock</span>
					</div>
					<div class="flex items-center justify-between pt-1">
						<span class="text-lg font-bold tabular">{money(p.price)}</span>
						<span class="text-xs text-muted-foreground">{p.sales.toLocaleString()} sold</span>
					</div>
				</div>
			</Card>
		{:else}
			<div class="col-span-full text-center py-16 text-muted-foreground">No products found.</div>
		{/each}
	</div>

	{#if totalPages > 1}
		<div class="flex items-center justify-between text-sm border-t border-border pt-4">
			<span class="text-muted-foreground">Page {page} of {totalPages}</span>
			<div class="flex gap-1">
				<Button variant="outline" size="sm" onclick={() => (page = Math.max(1, page - 1))} disabled={page === 1}>Prev</Button>
				{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => Math.max(1, Math.min(page - 2, totalPages - 4)) + i) as pg}
					<Button variant={pg === page ? 'primary' : 'ghost'} size="sm" onclick={() => (page = pg)}>{pg}</Button>
				{/each}
				<Button variant="outline" size="sm" onclick={() => (page = Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
			</div>
		</div>
	{/if}
</div>

<!-- Add/Edit Product Modal -->
<Modal
	bind:open={modalOpen}
	title={editingProduct ? `Edit ${editingProduct.name}` : 'Add Product'}
	description={editingProduct ? 'Update product details below.' : 'Fill in the details for your new product.'}
	maxWidth="2xl"
>
	<div class="space-y-4">
		<!-- Image Upload -->
		<ImageUpload label="Product Image" bind:value={formData.image} />

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FormField label="Name" required>
				<Input bind:value={formData.name} placeholder="Product name" />
			</FormField>
			<FormField label="Category">
				<Select bind:value={formData.category}>
					{#each ['License', 'Subscription', 'Add-on', 'Bundle'] as c}
						<option value={c}>{c}</option>
					{/each}
				</Select>
			</FormField>
		</div>

		<div class="grid grid-cols-3 gap-4">
			<FormField label="Price ($)">
				<Input type="number" bind:value={formData.price} min="0" step="0.01" />
			</FormField>
			<FormField label="Stock">
				<Input type="number" bind:value={formData.stock} min="0" />
			</FormField>
			<FormField label="Status">
				<Select bind:value={formData.status}>
					<option value="Active">Active</option>
					<option value="Draft">Draft</option>
					<option value="Archived">Archived</option>
				</Select>
			</FormField>
		</div>

		<FormField label="Description">
			<RichTextEditor bind:value={formData.description} placeholder="Describe your product..." />
		</FormField>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
		<Button onclick={saveProduct}>{editingProduct ? 'Save Changes' : 'Create Product'}</Button>
	{/snippet}
</Modal>
