<script lang="ts">
	import { money } from '$lib/utils';
	import { clientApi } from '$lib/api';
	import { Package, Plus } from '@lucide/svelte';
	import { StatCard, Card, Button, Input, Select, FormField, Modal, RichTextEditor, ImageUpload, Checkbox, Textarea, EmptyState } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';
	import type { Product } from '$lib/types/catalog';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let ALL = $state<Product[]>(data.products);

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

	$effect(() => {
		filtered;
		page = 1;
	});

	let modalOpen = $state(false);
	let isSaving = $state(false);
	let editingProduct: Product | null = $state(null);

	let formData = $state({
		name: '',
		category: 'Sunscreen',
		price: 0,
		stock: 0,
		status: 'Active' as Product['status'],
		bpomNumber: '',
		ageRange: '0 bln+',
		skinType: [] as string[],
		ingredients: '',
		description: '',
		image: ''
	});

	function slugify(text: string): string {
		return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
	}

	function openAdd() {
		editingProduct = null;
		formData = {
			name: '',
			category: 'Sunscreen',
			price: 0,
			stock: 0,
			status: 'Active',
			bpomNumber: '',
			ageRange: '0 bln+',
			skinType: [],
			ingredients: '',
			description: '',
			image: ''
		};
		modalOpen = true;
	}

	function openEdit(p: Product) {
		editingProduct = p;
		formData = {
			name: p.name,
			category: p.category,
			price: p.variants && p.variants.length > 0 ? Math.min(...p.variants.map((v) => v.price)) : p.price,
			stock: p.stock,
			status: p.status,
			bpomNumber: p.bpomNumber || '',
			ageRange: p.ageRange || '0 bln+',
			skinType: p.skinType ? [...p.skinType] : [],
			ingredients: p.ingredients || '',
			description: p.description || '',
			image: p.images && p.images.length > 0 ? p.images[0] : ''
		};
		modalOpen = true;
	}

	async function saveProduct() {
		if (!formData.name.trim()) {
			toast.danger('Validation', 'Product name is required.');
			return;
		}

		isSaving = true;
		try {
			if (editingProduct) {
				const updated = await clientApi.put<Product>(`/api/products/${editingProduct.id}`, { body: formData });
				const idx = ALL.findIndex((p) => p.id === updated.id);
				if (idx !== -1) ALL[idx] = updated;
				toast.success('Updated', `${formData.name} has been updated.`);
			} else {
				const created = await clientApi.post<Product>('/api/products', { body: formData });
				ALL = [created, ...ALL];
				toast.success('Created', `${formData.name} has been created.`);
			}
			modalOpen = false;
		} catch (e: any) {
			toast.danger('Error', e.message || 'Failed to save product');
		} finally {
			isSaving = false;
		}
	}
</script>

<!-- (UI remains identical minus Script) -->
<div class="space-y-6">
	<!-- Overview stats & header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Products</h1>
			<p class="mt-1 text-sm text-muted-foreground">{ALL.length} items in catalog</p>
		</div>
		<Button onclick={openAdd} class="gap-1.5"><Plus class="w-4 h-4" /> Add Product</Button>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Products" value={ALL.length} icon={Package} />
		<StatCard label="Active" value={ALL.filter((p) => p.status === 'Active').length} icon={Package} />
		<StatCard label="Draft" value={ALL.filter((p) => p.status === 'Draft').length} icon={Package} />
		<StatCard label="Archived" value={ALL.filter((p) => p.status === 'Archived').length} icon={Package} />
	</div>

	<!-- Filters & Table wrapper... -->
	<Card>
		<!-- Filters -->
		<div class="flex flex-wrap items-center gap-3 mb-5">
			<Input class="max-w-xs" placeholder="Search products…" bind:value={search} />
			<Select bind:value={statusFilter} class="w-32">
				<option value="All">All Status</option>
				<option value="Active">Active</option>
				<option value="Draft">Draft</option>
				<option value="Archived">Archived</option>
			</Select>
			<Select bind:value={categoryFilter} class="w-40">
				{#each categories as c}
					<option value={c}>{c === 'All' ? 'All Categories' : c}</option>
				{/each}
			</Select>
			{#if search || statusFilter !== 'All' || categoryFilter !== 'All'}
				<Button variant="ghost" size="sm" onclick={() => { search = ''; statusFilter = 'All'; categoryFilter = 'All'; }}>Clear</Button>
			{/if}
			<span class="ml-auto text-sm text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each rows as product (product.id)}
				<Card class="flex flex-col h-full overflow-hidden hover:border-primary/50 transition-colors p-0 cursor-pointer" onclick={() => openEdit(product)}>
					<!-- UI matching original layout exactly -->
					<div class="relative bg-muted/50 aspect-square border-b border-border p-4 flex items-center justify-center group">
						<img src={product.images[0]} alt={product.name} class="max-h-full object-contain drop-shadow transition-transform group-hover:scale-105" />
						<div class="absolute top-2 left-2 flex gap-1">
							<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider {product.status === 'Active' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}">{product.status}</span>
						</div>
					</div>
					<div class="p-4 flex-1 flex flex-col">
						<h3 class="font-medium text-sm line-clamp-2 leading-tight">{product.name}</h3>
						<div class="mt-1 flex items-center justify-between">
							<span class="text-xs text-muted-foreground">{product.category}</span>
							<span class="text-xs font-mono font-bold text-muted-foreground">{product.id}</span>
						</div>
						<div class="mt-auto pt-3">
							<div class="font-semibold tabular text-foreground">{money(product.price)}</div>
						</div>
					</div>
				</Card>
			{:else}
				<div class="col-span-full">
					<EmptyState title="No products found" description="Try adjusting your filters or search terms." />
				</div>
			{/each}
		</div>

		{#if totalPages > 1}
			<div class="flex items-center justify-between text-sm border-t border-border pt-4 mt-6">
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
	</Card>
</div>

<!-- Add/Edit Modal (Simplified form body to match previously generated UI) -->
<Modal bind:open={modalOpen} title={editingProduct ? `Edit ${editingProduct.name}` : 'Add Product'} maxWidth="2xl">
	<div class="space-y-4 max-h-[70vh] overflow-y-auto px-1">
		<ImageUpload label="Product First Image" bind:value={formData.image} />
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FormField label="Name" required><Input bind:value={formData.name} /></FormField>
			<FormField label="Category">
				<Select bind:value={formData.category}>
					{#each ['Sunscreen', 'Lotion', 'Sabun', 'Krim', 'Rambut'] as c}<option value={c}>{c}</option>{/each}
				</Select>
			</FormField>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<FormField label="Price (IDR)"><Input type="number" bind:value={formData.price} /></FormField>
			<FormField label="Stock"><Input type="number" bind:value={formData.stock} /></FormField>
			<FormField label="Status">
				<Select bind:value={formData.status}>
					<option value="Active">Active</option>
					<option value="Draft">Draft</option>
					<option value="Archived">Archived</option>
				</Select>
			</FormField>
		</div>
		<FormField label="Description">
			<RichTextEditor bind:value={formData.description} placeholder="Describe product benefits..." />
		</FormField>
	</div>

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
			<Button onclick={saveProduct} disabled={isSaving}>{isSaving ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Create Product')}</Button>
		</div>
	{/snippet}
</Modal>
